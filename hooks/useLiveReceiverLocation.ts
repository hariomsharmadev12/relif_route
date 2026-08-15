"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ReceiverLocation } from "@/types/pickup";

/**
 * For anyone watching a receiver's live position on a claimed listing
 * (e.g. a donor tracking who's coming to pick up their donation).
 */
export function useLiveReceiverLocation(receiverId: string | null) {
  const [location, setLocation] = useState<ReceiverLocation | null>(null);

  useEffect(() => {
    if (!receiverId) return;
    const supabase = createClient();
    let cancelled = false;

    supabase
      .from("receiver_locations")
      .select("*")
      .eq("receiver_id", receiverId)
      .maybeSingle()
      // Explicitly typing the destructured parameters to satisfy strict mode
      .then(({ data, error }: { data: any; error: any }) => {
        if (error) {
          console.error("Error fetching location:", error);
          return;
        }
        if (!cancelled) {
          setLocation((data as ReceiverLocation) ?? null);
        }
      });

    const channel = supabase
      .channel(`receiver-location-${receiverId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "receiver_locations",
          filter: `receiver_id=eq.${receiverId}`,
        },
        (payload: any) => {
          if (payload.eventType === "DELETE") {
            setLocation(null);
          } else {
            setLocation(payload.new as ReceiverLocation);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [receiverId]);

  return location;
}