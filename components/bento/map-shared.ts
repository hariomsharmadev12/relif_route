"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
}

// Green pin — the fixed point on both maps (the donor's pickup address).
export const fixedIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#1F6B4C;border:3px solid white;box-shadow:0 1px 4px rgba(20,30,24,0.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Blue pin — whichever side is actually moving: the NGO's own device on
// the NGO map, the rider's broadcast position on the donor map.
export const liveIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#2F6FED;border:3px solid white;box-shadow:0 1px 4px rgba(20,30,24,0.35)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export const MIN_REROUTE_DISTANCE_METERS = 40;
export const MIN_REROUTE_INTERVAL_MS = 8000;

export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function friendlyGeoError(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "Location access is blocked — allow location for this site to see the live route.";
    case err.POSITION_UNAVAILABLE:
      return "Can't get a GPS fix right now. Try moving outdoors or near a window.";
    case err.TIMEOUT:
      return "GPS took too long to respond. Retrying…";
    default:
      return err.message || "Couldn't get your location.";
  }
}

export async function fetchRoute(from: LatLng, to: LatLng): Promise<RouteInfo | null> {
  // OSRM's free public demo — swap for self-hosted OSRM (or Mapbox/ORS)
  // before this carries real traffic. Same server both maps use.
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

export function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points, { padding: [48, 48] });
  }, [points, map]);
  return null;
}