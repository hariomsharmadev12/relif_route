"use client";

// Must be dynamically imported with ssr:false wherever it's used — Leaflet
// touches `window` at module load time.
//
//   const ActivePickupMap = dynamic(() => import("./active-pickup-map"), {
//     ssr: false,
//     loading: () => <div className="h-[360px] rounded-2xl bg-[#F7F8F5] animate-pulse" />,
//   });
//
// Requires: npm install leaflet react-leaflet

import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation2, CheckCircle2, Phone } from "lucide-react";
import type { NgoFoodListing } from "./types";

const BROADCAST_INTERVAL_MS = 4000;

const donorIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#1F6B4C;border:3px solid white;box-shadow:0 1px 4px rgba(20,30,24,0.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const selfIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#2F6FED;border:3px solid white;box-shadow:0 1px 4px rgba(20,30,24,0.35)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteInfo {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
}

async function fetchRoute(from: LatLng, to: LatLng): Promise<RouteInfo | null> {
  // OSRM's free public demo — no key, but rate-limited. Swap for self-hosted
  // OSRM (or Mapbox/ORS) before this carries real volunteer traffic.
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;
    return {
      coordinates: route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      ),
      distanceMeters: route.distance,
      durationSeconds: route.duration,
    };
  } catch {
    return null;
  }
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points, { padding: [48, 48] });
  }, [points, map]);
  return null;
}

interface ActivePickupMapProps {
  listing: NgoFoodListing;
  onPickedUp: () => void;
}

export default function ActivePickupMap({ listing, onPickedUp }: ActivePickupMapProps) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [position, setPosition] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSentAt = useRef(0);

  const donor: LatLng | null =
    listing.latitude != null && listing.longitude != null
      ? { lat: listing.latitude, lng: listing.longitude }
      : null;

  // Watch + broadcast GPS while this card is mounted (i.e. while this
  // listing is the receiver's one active accepted task).
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available on this device.");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(next);

        const now = Date.now();
        if (now - lastSentAt.current > BROADCAST_INTERVAL_MS) {
          lastSentAt.current = now;
          supabase
            .rpc("upsert_my_location", {
              p_lat: next.lat,
              p_lng: next.lng,
              p_heading: pos.coords.heading,
            })
            .then(({ error }) => {
              if (error) console.error("broadcast location:", error);
            });
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [supabase]);

  useEffect(() => {
    if (!position || !donor) return;
    let cancelled = false;
    fetchRoute(position, donor).then((r) => {
      if (!cancelled) setRoute(r);
    });
    return () => {
      cancelled = true;
    };
  }, [position?.lat, position?.lng, donor?.lat, donor?.lng]);

  const points = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [];
    if (donor) pts.push([donor.lat, donor.lng]);
    if (position) pts.push([position.lat, position.lng]);
    return pts;
  }, [donor, position]);

  async function handleMarkPickedUp() {
    setIsBusy(true);
    setError(null);
    const { error } = await supabase.rpc("mark_listing_picked_up", {
      p_listing_id: listing.id,
    });
    setIsBusy(false);
    if (error) {
      setError("Couldn't mark this as picked up. Try again.");
      return;
    }
    onPickedUp();
  }

  const donorName =
    listing.donor?.donorType === "restaurant"
      ? listing.donor?.restaurantName || listing.donor?.contactPerson
      : listing.donor?.fullName;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-[#E7E9E4] bg-white">
      <div className="flex items-center justify-between border-b border-[#E7E9E4] px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C8B81]">
            Active pickup
          </p>
          <p className="text-[15px] font-medium text-[#14231C]">
            {listing.name} · {donorName || "Donor"}
          </p>
        </div>
        {listing.donor?.phone && (
          <a
            href={`tel:${listing.donor.phone}`}
            className="flex items-center gap-1.5 rounded-full border border-[#D5DAD1] px-3 py-1.5 text-[13px] font-medium text-[#5B675F] hover:border-[#1F6B4C] hover:text-[#1F6B4C]"
          >
            <Phone size={13} /> Call donor
          </a>
        )}
      </div>

      {donor ? (
        <div className="relative h-[320px] w-full">
          <MapContainer center={[donor.lat, donor.lng]} zoom={14} className="h-full w-full" scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[donor.lat, donor.lng]} icon={donorIcon} />
            {position && <Marker position={[position.lat, position.lng]} icon={selfIcon} />}
            {route && (
              <Polyline
                positions={route.coordinates}
                pathOptions={{ color: "#2F6FED", weight: 4, opacity: 0.85 }}
              />
            )}
            <FitBounds points={points} />
          </MapContainer>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/95 px-3 py-2 text-[13px] shadow-md backdrop-blur">
            <span className="flex items-center gap-1.5 text-[#5B675F]">
              <Navigation2 size={13} />
              {route
                ? `${(route.distanceMeters / 1000).toFixed(1)} km · ${Math.round(route.durationSeconds / 60)} min`
                : position
                  ? "Finding route…"
                  : "Waiting for GPS…"}
            </span>
          </div>
        </div>
      ) : (
        <p className="px-4 py-6 text-[13px] text-[#5B675F]">
          No pickup coordinates on file — go by the address instead:{" "}
          {listing.pickupAddress}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        {error && <span className="text-[13px] text-[#D64545]">{error}</span>}
        <button
          type="button"
          onClick={handleMarkPickedUp}
          disabled={isBusy}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-[#1F6B4C] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#195A3F] disabled:opacity-60"
        >
          <CheckCircle2 size={15} /> {isBusy ? "Updating…" : "Mark as picked up"}
        </button>
      </div>
    </div>
  );
}