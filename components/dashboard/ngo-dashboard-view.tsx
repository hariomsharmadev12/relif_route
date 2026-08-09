"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Inbox, PackageCheck, AlertCircle } from "lucide-react";
import { NgoFoodCard } from "./ngo-food-card";
import type { NgoFoodListing, ReceiverProfile } from "./types";
import { mapRowToNgoListing } from "./types";

type NgoTab = "pending" | "accepted";

export function NgoDashboardView() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [tab, setTab] = useState<NgoTab>("pending");
  const [receiver, setReceiver] = useState<ReceiverProfile | null>(null);
  const [listings, setListings] = useState<NgoFoodListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadEverything() {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in.");

      // 1. Load Receiver Profile
      const { data: receiverRow, error: receiverError } = await supabase
        .from("receivers")
        .select("id, org_name, full_name, phone, receiver_type")
        .eq("user_id", user.id)
        .single();
      if (receiverError) throw receiverError;

      const receiverProfile: ReceiverProfile = {
        id: receiverRow.id,
        orgName: receiverRow.org_name,
        fullName: receiverRow.full_name,
        phone: receiverRow.phone,
        receiverType: receiverRow.receiver_type,
      };
      setReceiver(receiverProfile);

      // 2. Fetch Listings AND the joined Donor automatically!
      const { data: listingRows, error: listingsError } = await supabase
        .from("food_listings")
        .select(
          `
          *,
          donors (
            donor_type,
            full_name,
            restaurant_name,
            contact_person,
            email,
            phone,
            address
          )
        `,
        )
        .order("created_at", { ascending: false });
      if (listingsError) throw listingsError;

      // 3. Fetch Declines
      const { data: declineRows, error: declinesError } = await supabase
        .from("food_listing_declines")
        .select("listing_id")
        .eq("receiver_id", receiverProfile.id);
      if (declinesError) throw declinesError;

      const declinedIds = new Set((declineRows ?? []).map((d) => d.listing_id));

      // 4. Filter visible listings
      const visibleRows = (listingRows ?? []).filter(
        (row: any) => !(row.status === "available" && declinedIds.has(row.id)),
      );

      // 5. Map the data to your UI state (passing the automatically joined donor object)
      setListings(
        visibleRows.map((row: any) =>
          mapRowToNgoListing(row, row.donors ?? null),
        ),
      );
    } catch (err) {
      console.error("Failed to load NGO dashboard:", err);
      setError("Couldn't load donations right now. Try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAccept(listingId: string) {
    if (!receiver) return;
    setBusyIds((prev) => new Set(prev).add(listingId));
    setError(null);

    const acceptedByName = receiver.orgName || receiver.fullName || "An NGO";
    const acceptedAt = new Date().toISOString();

    const { data, error: updateError } = await supabase
      .from("food_listings")
      .update({
        status: "accepted",
        accepted_by_receiver_id: receiver.id,
        accepted_by_name: acceptedByName,
        accepted_by_phone: receiver.phone,
        accepted_at: acceptedAt,
      })
      .eq("id", listingId)
      .eq("status", "available") // guards against a race with another NGO
      .select()
      .single();

    setBusyIds((prev) => {
      const next = new Set(prev);
      next.delete(listingId);
      return next;
    });

    if (updateError || !data) {
      console.error("Failed to accept listing:", updateError);
      setError(
        "That donation was just taken by another NGO, or something went wrong.",
      );
      await loadEverything();
      return;
    }

    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              status: "accepted",
              acceptedByReceiverId: receiver.id,
              acceptedByName,
              acceptedByPhone: receiver.phone,
              acceptedAt,
            }
          : l,
      ),
    );
  }

  async function handleDecline(listingId: string) {
    if (!receiver) return;
    setBusyIds((prev) => new Set(prev).add(listingId));
    setError(null);

    const { error: declineError } = await supabase
      .from("food_listing_declines")
      .insert({ listing_id: listingId, receiver_id: receiver.id });

    setBusyIds((prev) => {
      const next = new Set(prev);
      next.delete(listingId);
      return next;
    });

    if (declineError) {
      console.error("Failed to decline listing:", declineError);
      setError("Couldn't decline that listing. Try again.");
      return;
    }

    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }

  const pending = useMemo(
    () => listings.filter((l) => l.status === "available"),
    [listings],
  );
  const accepted = useMemo(
    () =>
      listings.filter(
        (l) =>
          l.status === "accepted" && l.acceptedByReceiverId === receiver?.id,
      ),
    [listings, receiver],
  );

  const activeList = tab === "pending" ? pending : accepted;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#7C8B81]">
          Welcome back
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-dashboard-display)] text-[32px] leading-tight text-[#14231C]">
          {receiver?.orgName || receiver?.fullName || "NGO"} dashboard
        </h1>
      </div>

      <div className="mt-6 inline-flex rounded-xl border border-[#E7E9E4] bg-white p-1">
        <TabButton
          active={tab === "pending"}
          onClick={() => setTab("pending")}
          icon={Inbox}
          label="Pending"
          count={pending.length}
        />
        <TabButton
          active={tab === "accepted"}
          onClick={() => setTab("accepted")}
          icon={PackageCheck}
          label="Accepted by you"
          count={accepted.length}
        />
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-1.5 text-[13px] text-[#D64545]">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <div className="mt-6">
        {isLoading ? (
          <LoadingState />
        ) : activeList.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeList.map((listing) => (
              <NgoFoodCard
                key={listing.id}
                listing={listing}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isBusy={busyIds.has(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Inbox;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-medium transition-colors ${
        active ? "bg-[#1F6B4C] text-white" : "text-[#5B675F] hover:bg-[#F7F8F5]"
      }`}
    >
      <Icon size={16} />
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
          active ? "bg-white/20 text-white" : "bg-[#EEF1EC] text-[#5B675F]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#E7E9E4] bg-white/60 px-6 py-14 text-center">
      <Loader2 size={20} className="animate-spin text-[#1F6B4C]" />
      <p className="text-[14px] text-[#5B675F]">Loading donations…</p>
    </div>
  );
}

function EmptyState({ tab }: { tab: NgoTab }) {
  const isPendingTab = tab === "pending";
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#D5DAD1] bg-white/60 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F1EB] text-[#1F6B4C]">
        {isPendingTab ? <Inbox size={20} /> : <PackageCheck size={20} />}
      </span>
      <p className="font-[family-name:var(--font-dashboard-display)] text-[18px] text-[#14231C]">
        {isPendingTab ? "No pending donations" : "Nothing accepted yet"}
      </p>
      <p className="max-w-sm text-[14px] text-[#5B675F]">
        {isPendingTab
          ? "New food donations near you will show up here as soon as donors list them."
          : "Donations you accept will appear here so you can track pickups."}
      </p>
    </div>
  );
}
