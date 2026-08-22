"use client";

// Read-only counterpart to active-pickup-map.tsx, shown on the donor
// dashboard. The donor's own position is fixed (their listing's pickup
// coordinates) — only the rider moves, so this polls `receiver_locations`
// instead of watching/broadcasting geolocation.
//
//   const ActiveDeliveryMap = dynamic(() => import("./active-delivery-map"), {
//     ssr: false,
//     loading: () => <div className="h-[320px] rounded-2xl bg-[#F7F8F5] animate-pulse" />,
//   });

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation2, Phone, Truck } from "lucide-react";
import type { DonorFoodListing, ReceiverLocationRow } from "./types";
import { mapRowToReceiverLocation } from "./types";
import {
  type LatLng,
  type RouteInfo,
  fixedIcon,
  liveIcon,
  haversineMeters,
  fetchRoute,
  FitBounds,
  MIN_REROUTE_DISTANCE_METERS,
  MIN_REROUTE_INTERVAL_MS,
} from "../bento/map-shared";

// Polling, not Realtime — avoids depending on a publication being enabled
// for receiver_locations. Swap for a Realtime channel later if this needs
// to feel more instant than every 4s.
const LOCATION_POLL_INTERVAL_MS = 4000;

interface ActiveDeliveryMapProps {
  listing: DonorFoodListing;
}

export default function ActiveDeliveryMap({ listing }: ActiveDeliveryMapProps) {
  const [supabase] = useState(() => createClient());

  const [riderPosition, setRiderPosition] = useState<LatLng | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRoutedPosition = useRef<LatLng | null>(null);
  const lastRouteFetchAt = useRef(0);

  const donorLocation: LatLng | null =
    listing.latitude != null && listing.longitude != null
      ? { lat: listing.latitude, lng: listing.longitude }
      : null;

  const receiverId = listing.acceptedByReceiverId;

  useEffect(() => {
    if (!receiverId) return;
    let cancelled = false;

async function poll() {
  const { data, error: fetchError } = await supabase
    .from("receiver_locations")
    .select("receiver_id, lat, lng, heading, updated_at")
    .eq("receiver_id", receiverId)
    .maybeSingle();

  if (cancelled) return;

  if (fetchError) {
    console.error("Failed to fetch rider location:", fetchError);
    setError("Couldn't load the rider's location.");
    return;
  }
  if (!data) return; // rider hasn't broadcast a position yet

  const loc = mapRowToReceiverLocation(data as ReceiverLocationRow);
  setRiderPosition({ lat: loc.lat, lng: loc.lng });
  setLastUpdatedAt(loc.updatedAt);
  setError(null);
}
    poll();
    const intervalId = setInterval(poll, LOCATION_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [supabase, receiverId]);

  // Same throttled re-routing as the NGO map: only re-fetch once the rider
  // has moved a meaningful distance and enough time has passed.
  useEffect(() => {
    if (!riderPosition || !donorLocation) return;

    const now = Date.now();
    const last = lastRoutedPosition.current;
    const movedEnough =
      !last || haversineMeters(last, riderPosition) >= MIN_REROUTE_DISTANCE_METERS;
    const enoughTimePassed =
      now - lastRouteFetchAt.current >= MIN_REROUTE_INTERVAL_MS;

    if (lastRouteFetchAt.current !== 0 && (!movedEnough || !enoughTimePassed)) return;

    let cancelled = false;
    lastRouteFetchAt.current = now;
    setIsRouting(true);

    fetchRoute(riderPosition, donorLocation).then((r) => {
      if (cancelled) return;
      setIsRouting(false);
      if (r) {
        setRoute(r);
        lastRoutedPosition.current = riderPosition;
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riderPosition?.lat, riderPosition?.lng, donorLocation?.lat, donorLocation?.lng]);

  const points = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [];
    if (donorLocation) pts.push([donorLocation.lat, donorLocation.lng]);
    if (riderPosition) pts.push([riderPosition.lat, riderPosition.lng]);
    return pts;
  }, [donorLocation, riderPosition]);

  const riderName =
    listing.receiver?.receiverType === "ngo"
      ? listing.receiver?.orgName || listing.receiver?.fullName
      : listing.receiver?.fullName;

  const staleMinutes = lastUpdatedAt
    ? Math.floor((Date.now() - new Date(lastUpdatedAt).getTime()) / 60000)
    : null;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7E9E4] bg-white">
      <div className="flex items-center justify-between border-b border-[#E7E9E4] px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C8B81]">
            On the way
          </p>
          <p className="text-[15px] font-medium text-[#14231C]">
            {listing.name} · {riderName || "Volunteer"}
          </p>
        </div>
        {listing.receiver?.phone && (<a>
  
    href={`tel:${listing.receiver.phone}`}
    className="flex items-center gap-1.5 rounded-full border border-[#D5DAD1] px-3 py-1.5 text-[13px] font-medium text-[#5B675F] hover:border-[#1F6B4C] hover:text-[#1F6B4C]"
  
    <Phone size={13} /> Call rider
  </a>
)}
          
            
        
      </div>

      {donorLocation ? (
        <div className="relative h-[320px] w-full">
          <MapContainer
            center={[donorLocation.lat, donorLocation.lng]}
            zoom={14}
            className="h-full w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[donorLocation.lat, donorLocation.lng]} icon={fixedIcon} />
            {riderPosition && (
              <Marker position={[riderPosition.lat, riderPosition.lng]} icon={liveIcon} />
            )}
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
                ? `${(route.distanceMeters / 1000).toFixed(1)} km away · ~${Math.round(route.durationSeconds / 60)} min${isRouting ? " · updating…" : ""}`
                : riderPosition
                  ? "Finding route…"
                  : "Waiting for rider's location…"}
            </span>
            {staleMinutes !== null && staleMinutes >= 3 && (
              <span className="text-[#B8860B]">Last seen {staleMinutes} min ago</span>
            )}
          </div>
        </div>
      ) : (
        <p className="px-4 py-6 text-[13px] text-[#5B675F]">
          No pickup coordinates on file for this listing.
        </p>
      )}

      {error && <p className="px-4 pb-3 text-[13px] text-[#D64545]">{error}</p>}

      <div className="flex items-center gap-1.5 px-4 pb-3 text-[12px] text-[#7C8B81]">
        <Truck size={13} /> A volunteer accepted this listing and is on the way to pick it up.
      </div>
    </div>
  );
}