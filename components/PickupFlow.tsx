"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { useActiveListing } from "@/hooks/useActiveListing";
import { useWatchAndBroadcastLocation } from "@/hooks/useWatchAndBroadcastLocation";
import { markListingCollected, releaseListing } from "@/lib/supabase/pickupActions";
import AvailableListings from "@/components/AvailableListings";
import { PickupError } from "@/types/pickup";

// Leaflet needs window — must load client-side only.
const PickupTrackingMap = dynamic(() => import("@/components/PickupTrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] rounded-2xl bg-neutral-100 animate-pulse" />
  ),
});

/**
 * Top-level pickup screen for a signed-in receiver/volunteer. No props
 * needed — identity comes from the Supabase session via auth.uid() inside
 * the hooks and RPCs, so this can be dropped straight into a page.
 */
export default function PickupFlow() {
  const { activeListing, loading, refetch } = useActiveListing();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { position } = useWatchAndBroadcastLocation(
    Boolean(activeListing) // only track while there's a live pickup in progress
  );

  async function handleMarkCollected() {
    if (!activeListing) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    try {
      await markListingCollected(supabase, activeListing.id);
      refetch(); // drops back to the available-listings screen
    } catch (err) {
      setError(err instanceof PickupError ? err.message : "Couldn't update this pickup.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRelease() {
    if (!activeListing) return;
    if (!confirm("Return this pickup to the available pool?")) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    try {
      await releaseListing(supabase, activeListing.id);
      refetch();
    } catch (err) {
      setError(err instanceof PickupError ? err.message : "Couldn't release this pickup.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="w-full h-96 rounded-2xl bg-neutral-100 animate-pulse" />;
  }

  // ── No active task: browse and accept ──────────────────────────────────
  if (!activeListing) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Available pickups</h2>
        <AvailableListings onClaimed={refetch} />
      </div>
    );
  }

  // ── Active task: single-task lock in effect, show tracking screen ──────
  const donorName =
    activeListing.donor?.restaurant_name ?? activeListing.donor?.full_name ?? "Donor";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Heading to pickup</h2>
        <span className="text-xs font-medium uppercase tracking-wide text-blue-600 bg-blue-50 rounded-full px-2.5 py-1">
          In progress
        </span>
      </div>

      {activeListing.latitude != null && activeListing.longitude != null ? (
        <PickupTrackingMap
          donor={{
            name: donorName,
            lat: activeListing.latitude,
            lng: activeListing.longitude,
            address: activeListing.pickup_address,
          }}
          volunteerPosition={position}
        />
      ) : (
        <p className="text-sm text-neutral-500 rounded-xl border border-neutral-200 p-4">
          This listing doesn't have pickup coordinates on file — go by the address instead:{" "}
          {activeListing.pickup_address}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleMarkCollected}
          disabled={busy}
          className="flex-1 rounded-full bg-green-600 text-white font-medium py-3 disabled:opacity-50 hover:bg-green-700 transition-colors"
        >
          {busy ? "Updating…" : "Mark as collected"}
        </button>
        <button
          onClick={handleRelease}
          disabled={busy}
          className="rounded-full border border-neutral-300 text-neutral-600 font-medium px-4 py-3 disabled:opacity-50 hover:bg-neutral-50 transition-colors"
        >
          Can't make it
        </button>
      </div>

      <p className="text-xs text-neutral-400 text-center">
        You can't accept another pickup until this one is marked collected.
      </p>
    </div>
  );
}