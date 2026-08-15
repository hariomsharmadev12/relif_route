"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAvailableListings } from "@/hooks/useAvailableListings";
import { claimListing } from "@/lib/supabase/pickupActions";
import { PickupError } from "@/types/pickup";

interface AvailableListingsProps {
  onClaimed: () => void; // parent re-checks useActiveListing and swaps to the map
}

export default function AvailableListings({ onClaimed }: AvailableListingsProps) {
  const { listings, loading } = useAvailableListings();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  async function handleAccept(listingId: string) {
    setClaimingId(listingId);
    setBanner(null);
    const supabase = createClient();
    try {
      await claimListing(supabase, listingId);
      onClaimed();
    } catch (err) {
      // LISTING_ALREADY_CLAIMED means someone else won the race — the
      // realtime subscription will drop it from the list momentarily.
      if (err instanceof PickupError) {
        setBanner(err.message);
      } else {
        setBanner("Couldn't accept this pickup. Try again.");
      }
    } finally {
      setClaimingId(null);
    }
  }

  if (loading) {
    return <p className="text-neutral-500 text-sm py-8 text-center">Loading nearby pickups…</p>;
  }

  if (listings.length === 0) {
    return (
      <p className="text-neutral-500 text-sm py-8 text-center">
        No pickups available right now — check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2"
          >
            {banner}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {listings.map((listing) => (
          <motion.div
            key={listing.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-neutral-900 truncate">
                {listing.name} · {listing.quantity} {listing.unit}
              </p>
              <p className="text-sm text-neutral-600 truncate">
                {listing.donor?.restaurant_name ?? listing.donor?.full_name ?? "Donor"}
              </p>
              <p className="text-sm text-neutral-500 truncate">
                {listing.pickup_address}
              </p>
            </div>
            <button
              onClick={() => handleAccept(listing.id)}
              disabled={claimingId === listing.id}
              className="shrink-0 rounded-full bg-green-600 text-white text-sm font-medium px-4 py-2 disabled:opacity-50 hover:bg-green-700 transition-colors"
            >
              {claimingId === listing.id ? "Accepting…" : "Accept"}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}