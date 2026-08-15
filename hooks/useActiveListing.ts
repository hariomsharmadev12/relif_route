"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMyReceiverId } from "@/hooks/useMyReceiverId";
import type { FoodListingWithDonor } from "@/types/pickup";

interface UseActiveListingResult {
  activeListing: FoodListingWithDonor | null;
  loading: boolean;
  refetch: () => void;
}

/**
 * The signed-in receiver's current claimed listing (there can be at most
 * one — enforced by the DB's one_active_pickup_per_receiver index), kept
 * live via Realtime. Drives the UI split between "browse available
 * listings" and "track my pickup".
 */
export function useActiveListing(): UseActiveListingResult {
  const { receiverId, loading: receiverLoading } = useMyReceiverId();
  const [activeListing, setActiveListing] = useState<FoodListingWithDonor | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (receiverLoading) return;
    if (!receiverId) {
      setActiveListing(null);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("food_listings")
        .select(
          "*, donor:donors(id, full_name, restaurant_name, phone, address)"
        )
        .eq("accepted_by_receiver_id", receiverId)
        .eq("status", "claimed")
        .maybeSingle();

      if (!cancelled) {
        if (error) console.error("useActiveListing:", error);
        setActiveListing((data as FoodListingWithDonor | null) ?? null);
        setLoading(false);
      }
    }
    load();

    const channel = supabase
      .channel(`active-listing-${receiverId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_listings",
          filter: `accepted_by_receiver_id=eq.${receiverId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [receiverId, receiverLoading, nonce]);

  return { activeListing, loading: receiverLoading || loading, refetch: () => setNonce((n) => n + 1) };
}