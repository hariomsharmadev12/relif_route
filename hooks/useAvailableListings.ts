"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FoodListingWithDonor } from "@/types/pickup";

/**
 * Live list of unclaimed (status = 'available') food listings. Realtime-
 * subscribed so a listing disappears from every other receiver's screen
 * the instant someone claims it.
 */
export function useAvailableListings() {
  const [listings, setListings] = useState<FoodListingWithDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("food_listings")
        .select(
          "*, donor:donors(id, full_name, restaurant_name, phone, address)"
        )
        .eq("status", "available")
        .order("created_at", { ascending: true });

      if (!cancelled) {
        if (error) console.error("useAvailableListings:", error);
        setListings((data as FoodListingWithDonor[]) ?? []);
        setLoading(false);
      }
    }
    load();

    const channel = supabase
      .channel("available-listings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "food_listings" },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { listings, loading };
}