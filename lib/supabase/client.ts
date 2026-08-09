import { createBrowserClient } from "@supabase/ssr";

// A single shared Supabase client for the whole browser tab.
//
// Every component that previously did its own:
//   useState(() => createBrowserClient(url, key))
// should instead do:
//   const supabase = createClient();
//
// Creating multiple independent client instances in the same tab causes
// Supabase's "Multiple GoTrueClient instances detected" problem — each
// instance manages its own in-memory session/token-refresh state against
// the same storage key, and they can drift out of sync with each other.
// That's what causes uploads or fetches to silently run against a stale
// or different session than the one actually logged in, even without
// switching tabs. A module-level singleton guarantees every part of the
// app is always looking at the exact same session.

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
