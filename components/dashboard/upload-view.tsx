"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  ImagePlus,
  LocateFixed,
  Loader2,
  AlertCircle,
  X,
  MapPin,
} from "lucide-react";
import type { FoodListing, FoodUnit } from "./types";
import { FOOD_UNITS } from "./types";
import { FoodCard } from "./food-card";

interface UploadViewProps {
  listings: FoodListing[];
  isLoading: boolean;
  onSubmitted: (listing: FoodListing) => void;
}

type LocateState = "idle" | "locating" | "done" | "error";

interface AddressSuggestion {
  label: string;
  lat: number;
  lng: number;
}

const ADDRESS_SEARCH_DEBOUNCE_MS = 500;
const ADDRESS_SEARCH_MIN_CHARS = 4;

// Supabase/Postgres errors carry message/details/hint/code — pull out
// whatever is present instead of showing "[object Object]".
function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const e = err as { message?: string; details?: string; hint?: string };
    return (
      [e.message, e.details, e.hint].filter(Boolean).join(" — ") ||
      "Unknown error"
    );
  }
  return String(err);
}

// Forward geocoding via OpenStreetMap's free Nominatim API — same family
// as the reverse-geocoding call below. Fine for demo/low volume; for real
// production traffic, proxy this through your own server (or switch to a
// paid geocoder) to respect Nominatim's usage policy.
async function searchAddress(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
    { signal },
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .map((d: any) => ({
      label: d.display_name as string,
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
    }))
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
}

export function UploadView({ listings, isLoading, onSubmitted }: UploadViewProps) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<FoodUnit>("servings");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [goodUntil, setGoodUntil] = useState("");

  const [locateState, setLocateState] = useState<LocateState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Address-as-you-type suggestions.
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchAbortRef.current?.abort();
    };
  }, []);

  function handlePickFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Donor is typing the address by hand. Whatever coords we had (from a
  // previous "Use current" click or a previously picked suggestion) no
  // longer match this text, so clear them — handleSubmit will try a
  // last-chance geocode on submit if nothing gets picked from the list.
  function handleAddressChange(value: string) {
    setAddress(value);
    setCoords(null);
    setShowSuggestions(true);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchAbortRef.current?.abort();

    const trimmed = value.trim();
    if (trimmed.length < ADDRESS_SEARCH_MIN_CHARS) {
      setSuggestions([]);
      setIsSearchingAddress(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      searchAbortRef.current = controller;
      setIsSearchingAddress(true);
      try {
        const results = await searchAddress(trimmed, controller.signal);
        setSuggestions(results);
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") setSuggestions([]);
      } finally {
        setIsSearchingAddress(false);
      }
    }, ADDRESS_SEARCH_DEBOUNCE_MS);
  }

  function selectSuggestion(s: AddressSuggestion) {
    setAddress(s.label);
    setCoords({ lat: s.lat, lng: s.lng });
    setSuggestions([]);
    setShowSuggestions(false);
  }

  // Reads the browser's current position, then reverse-geocodes it with
  // OpenStreetMap's free Nominatim API so the address field fills itself
  // in. The donor can still edit the address by hand afterwards (which
  // will clear these coords and fall back to search-as-you-type).
  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocateState("error");
      setError("Location isn't available in this browser.");
      return;
    }

    setLocateState("locating");
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          setAddress(data?.display_name ?? `${latitude}, ${longitude}`);
        } catch {
          // Reverse geocoding is a nicety — coordinates alone are enough
          // to still act on the listing.
          setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setLocateState("done");
        }
      },
      () => {
        setLocateState("error");
        setError(
          "Couldn't get your location. Check location permissions, or type the pickup address manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  function resetForm() {
    clearPhoto();
    setName("");
    setQuantity("");
    setUnit("servings");
    setAddress("");
    setCoords(null);
    setGoodUntil("");
    setLocateState("idle");
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearchingAddress(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!photoFile) return setError("Add a photo of the food.");
    if (!name.trim()) return setError("Give the food a name.");
    if (!quantity || Number(quantity) <= 0)
      return setError("Enter how much food there is.");
    if (!address.trim()) return setError("Add a pickup location.");
    if (!goodUntil) return setError("Set the time this food is good until.");
    if (new Date(goodUntil).getTime() <= Date.now())
      return setError("The good-until time needs to be in the future.");

    setIsSubmitting(true);

    // If the donor typed an address but never picked a suggestion (or
    // typed something new after picking one), we won't have coords yet.
    // Try one last geocode before falling back to address-only — this is
    // what was missing before, and why typed addresses saved with no
    // latitude/longitude.
    let finalCoords = coords;
    if (!finalCoords && address.trim()) {
      try {
        const results = await searchAddress(address.trim());
        if (results[0]) finalCoords = { lat: results[0].lat, lng: results[0].lng };
      } catch {
        // Best effort — the listing can still save with just the address.
      }
    }

    // Local-first: build the listing immediately so the UI never blocks
    // on the network, then try to persist it to Supabase in the background.
    const localListing: FoodListing = {
      id: crypto.randomUUID(),
      photoUrl: photoPreview!,
      name: name.trim(),
      quantity: Number(quantity),
      unit,
      pickupAddress: address.trim(),
      latitude: finalCoords?.lat ?? null,
      longitude: finalCoords?.lng ?? null,
      goodUntil: new Date(goodUntil).toISOString(),
      createdAt: new Date().toISOString(),
      status: "available",
      acceptedByReceiverId: null,
      acceptedByName: null,
      acceptedByPhone: null,
      acceptedAt: null,
    };

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // Everything downstream (storage RLS + the donor_id FK) requires
      // a real signed-in donor. Fail fast with a clear reason instead
      // of silently uploading to an "anonymous" folder that RLS will
      // reject anyway.
      if (userError || !user) {
        throw new Error(
          "You're not signed in — log in as a donor and try listing again.",
        );
      }

      // donors.id (the FK target on food_listings.donor_id) is the
      // donor's own row id, resolved from the signed-in user's auth id
      // via donors.user_id. The RLS insert policy (my_donor_id()) also
      // expects donor_id = donors.id, so the FK and RLS now agree.
      const { data: donorRow, error: donorError } = await supabase
        .from("donors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (donorError) throw donorError;
      if (!donorRow) {
        throw new Error(
          "No donor profile found for this account — finish donor signup first.",
        );
      }

      // Upload the photo to the `food-photos` storage bucket.
      const filePath = `${user.id}/${localListing.id}-${photoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("food-photos")
        .upload(filePath, photoFile);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("food-photos").getPublicUrl(filePath);

      // Insert the row into `food_listings`. Adjust the table/column
      // names here to match your actual Supabase schema.
      const { error: insertError } = await supabase
        .from("food_listings")
        .insert({
          id: localListing.id,
          donor_id: donorRow.id,
          name: localListing.name,
          quantity: localListing.quantity,
          unit: localListing.unit,
          pickup_address: localListing.pickupAddress,
          latitude: localListing.latitude,
          longitude: localListing.longitude,
          good_until: localListing.goodUntil,
          photo_url: publicUrl,
          status: localListing.status,
        });
      if (insertError) throw insertError;

      onSubmitted({ ...localListing, photoUrl: publicUrl });
      setSuccessMessage("Food listed — volunteers nearby can now see it.");
      resetForm();
    } catch (err) {
      // Keep the listing visible locally so the flow still demos
      // end-to-end even if the Supabase save failed, but show the *real*
      // reason instead of a generic message.
      const reason = describeError(err);
      console.error("Failed to save listing to Supabase:", err);
      onSubmitted(localListing);
      setSuccessMessage(
        `Food listed locally only — Supabase save failed: ${reason}`,
      );
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#7C8B81]">
          List surplus food
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-dashboard-display)] text-[32px] leading-tight text-[#14231C]">
          Upload food
        </h1>
        <p className="mt-2 max-w-xl text-[14px] text-[#5B675F]">
          Add a photo, say how much there is and where to collect it, and set
          how long it's good for. It goes straight to nearby volunteers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]"
      >
        {/* Photo */}
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-[#14231C]">
            Photo
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handlePickFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragging
                ? "border-[#1F6B4C] bg-[#E6F1EB]"
                : "border-[#D5DAD1] bg-white hover:border-[#1F6B4C]/60"
            }`}
          >
            {photoPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Food preview"
                  className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPhoto();
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75"
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F1EB] text-[#1F6B4C]">
                  <ImagePlus size={20} />
                </span>
                <p className="text-[14px] font-medium text-[#14231C]">
                  Drag a photo here, or click to choose
                </p>
                <p className="text-[12px] text-[#7C8B81]">PNG or JPG</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePickFile(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="food-name"
              className="mb-1.5 block text-[13px] font-semibold text-[#14231C]"
            >
              Food name
            </label>
            <input
              id="food-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vegetable biryani"
              className="w-full rounded-xl border border-[#D5DAD1] bg-white px-4 py-3 text-[14px] text-[#14231C] outline-none placeholder:text-[#A6AEA8] focus:border-[#1F6B4C] focus:ring-2 focus:ring-[#1F6B4C]/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="quantity"
                className="mb-1.5 block text-[13px] font-semibold text-[#14231C]"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="20"
                className="w-full rounded-xl border border-[#D5DAD1] bg-white px-4 py-3 text-[14px] text-[#14231C] outline-none placeholder:text-[#A6AEA8] focus:border-[#1F6B4C] focus:ring-2 focus:ring-[#1F6B4C]/15"
              />
            </div>
            <div>
              <label
                htmlFor="unit"
                className="mb-1.5 block text-[13px] font-semibold text-[#14231C]"
              >
                Unit
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as FoodUnit)}
                className="w-full rounded-xl border border-[#D5DAD1] bg-white px-4 py-3 text-[14px] text-[#14231C] outline-none focus:border-[#1F6B4C] focus:ring-2 focus:ring-[#1F6B4C]/15"
              >
                {FOOD_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="address"
              className="mb-1.5 block text-[13px] font-semibold text-[#14231C]"
            >
              Pickup location
            </label>
            <div className="flex gap-2">
              <input
                id="address"
                type="text"
                autoComplete="off"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  // Delay so a click on a suggestion (onMouseDown below)
                  // registers before the dropdown disappears.
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                placeholder="Street, area, landmark"
                className="w-full rounded-xl border border-[#D5DAD1] bg-white px-4 py-3 text-[14px] text-[#14231C] outline-none placeholder:text-[#A6AEA8] focus:border-[#1F6B4C] focus:ring-2 focus:ring-[#1F6B4C]/15"
              />
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locateState === "locating"}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#D5DAD1] bg-white px-3.5 text-[13px] font-medium text-[#1F6B4C] hover:border-[#1F6B4C] disabled:opacity-60"
              >
                {locateState === "locating" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <LocateFixed size={15} />
                )}
                Use current
              </button>
            </div>

            {showSuggestions && (isSearchingAddress || suggestions.length > 0) && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-[#D5DAD1] bg-white shadow-lg">
                {isSearchingAddress && suggestions.length === 0 ? (
                  <p className="flex items-center gap-2 px-4 py-3 text-[13px] text-[#7C8B81]">
                    <Loader2 size={14} className="animate-spin" /> Searching…
                  </p>
                ) : (
                  suggestions.map((s, i) => (
                    <button
                      key={`${s.lat}-${s.lng}-${i}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(s);
                      }}
                      className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-[13px] text-[#14231C] hover:bg-[#F7F8F5]"
                    >
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#7C8B81]" />
                      <span className="line-clamp-2">{s.label}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {coords ? (
              <p className="mt-1.5 font-[family-name:var(--font-dashboard-mono)] text-[11px] text-[#7C8B81]">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            ) : (
              address.trim().length > 0 && (
                <p className="mt-1.5 text-[11px] text-[#A6AEA8]">
                  Pick a suggestion above to pin the exact location
                </p>
              )
            )}
          </div>

          <div>
            <label
              htmlFor="good-until"
              className="mb-1.5 block text-[13px] font-semibold text-[#14231C]"
            >
              Good until
            </label>
            <input
              id="good-until"
              type="datetime-local"
              value={goodUntil}
              onChange={(e) => setGoodUntil(e.target.value)}
              className="w-full rounded-xl border border-[#D5DAD1] bg-white px-4 py-3 text-[14px] text-[#14231C] outline-none focus:border-[#1F6B4C] focus:ring-2 focus:ring-[#1F6B4C]/15"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-[13px] text-[#D64545]">
              <AlertCircle size={14} /> {error}
            </p>
          )}
          {successMessage && (
            <p className="text-[13px] text-[#1F6B4C]">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F6B4C] px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#195A3F] disabled:opacity-60 sm:w-fit"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Listing food…" : "List this food"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="mt-12">
          <h2 className="font-[family-name:var(--font-dashboard-display)] text-[20px] text-[#14231C]">
            Already uploaded
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-[#EEF1EC]"
              />
            ))}
          </div>
        </div>
      ) : (
        listings.length > 0 && (
          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-dashboard-display)] text-[20px] text-[#14231C]">
              Already uploaded
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <FoodCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}