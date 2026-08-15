"use client";

// NOTE: import this component with next/dynamic and { ssr: false } wherever
// you use it — Leaflet reads `window` at module load time and will throw
// during server rendering otherwise.
//
//   const PickupTrackingMap = dynamic(
//     () => import("@/components/PickupTrackingMap"),
//     { ssr: false }
//   );
//
// Requires: npm install leaflet react-leaflet

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const donorIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#16a34a;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const volunteerIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
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
  // OSRM's free public demo server — no API key, but rate-limited and not
  // meant for production traffic. Self-host OSRM (or swap in a provider
  // like Mapbox/OpenRouteService) before this goes to real volunteers.
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;
    return {
      coordinates: route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
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

interface PickupTrackingMapProps {
  donor: { name: string; lat: number; lng: number; address?: string | null };
  volunteerPosition: LatLng | null;
}

export default function PickupTrackingMap({
  donor,
  volunteerPosition,
}: PickupTrackingMapProps) {
  const [route, setRoute] = useState<RouteInfo | null>(null);

  useEffect(() => {
    if (!volunteerPosition) return;
    let cancelled = false;
    fetchRoute(volunteerPosition, { lat: donor.lat, lng: donor.lng }).then(
      (r) => {
        if (!cancelled) setRoute(r);
      }
    );
    return () => {
      cancelled = true;
    };
    // For production, throttle this to every 30-60s rather than every GPS
    // tick — re-fetching on each position update is fine for a demo but
    // will burn through OSRM's public rate limit quickly in real use.
  }, [volunteerPosition?.lat, volunteerPosition?.lng, donor.lat, donor.lng]);

  const points = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [[donor.lat, donor.lng]];
    if (volunteerPosition) pts.push([volunteerPosition.lat, volunteerPosition.lng]);
    return pts;
  }, [donor, volunteerPosition]);

  const center: [number, number] = volunteerPosition
    ? [volunteerPosition.lat, volunteerPosition.lng]
    : [donor.lat, donor.lng];

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-neutral-200">
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[donor.lat, donor.lng]} icon={donorIcon} />
        {volunteerPosition && (
          <Marker
            position={[volunteerPosition.lat, volunteerPosition.lng]}
            icon={volunteerIcon}
          />
        )}
        {route && (
          <Polyline
            positions={route.coordinates}
            pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.85 }}
          />
        )}
        <FitBounds points={points} />
      </MapContainer>

      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-xl px-4 py-2 shadow-md flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-800 truncate">{donor.name}</span>
        {route ? (
          <span className="text-neutral-500 shrink-0 ml-3">
            {(route.distanceMeters / 1000).toFixed(1)} km ·{" "}
            {Math.round(route.durationSeconds / 60)} min
          </span>
        ) : (
          <span className="text-neutral-400 shrink-0 ml-3">
            {volunteerPosition ? "Finding route…" : "Waiting for GPS…"}
          </span>
        )}
      </div>
    </div>
  );
}