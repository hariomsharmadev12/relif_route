"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { pushMyLocation } from "@/lib/supabase/pickupActions";

interface Position {
  lat: number;
  lng: number;
  heading: number | null;
}

const BROADCAST_INTERVAL_MS = 4000; // don't hammer the DB on every GPS tick

/**
 * Call this while the signed-in receiver has an active claimed listing.
 * `enabled` should track that — stop watching/broadcasting the moment the
 * listing is marked collected or released, for both battery life and
 * privacy. Identity is resolved server-side via auth.uid() inside
 * upsert_my_location(), so this hook never needs to know the caller's own
 * receiver id.
 */
export function useWatchAndBroadcastLocation(enabled: boolean) {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSentAt = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available on this device.");
      return;
    }

    const supabase = createClient();

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const next: Position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          heading: pos.coords.heading,
        };
        setPosition(next);

        const now = Date.now();
        if (now - lastSentAt.current > BROADCAST_INTERVAL_MS) {
          lastSentAt.current = now;
          pushMyLocation(supabase, next.lat, next.lng, next.heading).catch(
            (e) => console.error("broadcast location:", e)
          );
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return { position, error };
}