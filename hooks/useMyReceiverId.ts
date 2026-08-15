"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Resolves the signed-in user's own receivers.id. Needed client-side only
 * for scoping realtime-filtered queries (e.g. "my claimed listing") — the
 * RPCs themselves never trust a client-supplied id, they resolve it from
 * auth.uid() server-side.
 */
export function useMyReceiverId(): { receiverId: string | null; loading: boolean } {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setReceiverId(null);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("receivers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) {
        if (error) console.error("useMyReceiverId:", error);
        setReceiverId(data?.id ?? null);
        setLoading(false);
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { receiverId, loading };
}