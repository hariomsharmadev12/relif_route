import type { SupabaseClient } from "@supabase/supabase-js";
import type { FoodListing, PickupErrorCode } from "@/types/pickup";
import { PickupError } from "@/types/pickup";

const KNOWN_CODES: PickupErrorCode[] = [
  "NOT_AUTHENTICATED",
  "NOT_A_RECEIVER",
  "RECEIVER_HAS_ACTIVE_TASK",
  "LISTING_ALREADY_CLAIMED",
  "NOT_YOUR_ACTIVE_PICKUP",
];

const MESSAGES: Record<PickupErrorCode, string> = {
  NOT_AUTHENTICATED: "You need to be signed in to do that.",
  NOT_A_RECEIVER: "Only registered receivers/volunteers can accept pickups.",
  RECEIVER_HAS_ACTIVE_TASK:
    "You already have an active pickup. Finish it before accepting another.",
  LISTING_ALREADY_CLAIMED: "This listing was just claimed by someone else.",
  NOT_YOUR_ACTIVE_PICKUP: "This isn't your active pickup anymore.",
};

function toPickupError(error: { message: string }): PickupError {
  const code = KNOWN_CODES.find((c) => error.message.includes(c));
  if (code) return new PickupError(code, MESSAGES[code]);
  return new PickupError("UNKNOWN", error.message);
}

/**
 * Accept a food listing. The single-active-task lock and the anti-race
 * claim are enforced server-side in claim_listing() — this is a thin,
 * error-typed wrapper around that RPC.
 */
export async function claimListing(
  supabase: SupabaseClient,
  listingId: string
): Promise<FoodListing> {
  const { data, error } = await supabase.rpc("claim_listing", {
    p_listing_id: listingId,
  });
  if (error) throw toPickupError(error);
  return data as FoodListing;
}

export async function markListingCollected(
  supabase: SupabaseClient,
  listingId: string
): Promise<FoodListing> {
  const { data, error } = await supabase.rpc("mark_listing_collected", {
    p_listing_id: listingId,
  });
  if (error) throw toPickupError(error);
  return data as FoodListing;
}

export async function releaseListing(
  supabase: SupabaseClient,
  listingId: string
): Promise<FoodListing> {
  const { data, error } = await supabase.rpc("release_listing", {
    p_listing_id: listingId,
  });
  if (error) throw toPickupError(error);
  return data as FoodListing;
}

/**
 * Push the current user's GPS fix. Resolves their receivers.id server-side
 * (via upsert_my_location's auth.uid() lookup) so the client never needs to
 * know its own receiver id.
 */
export async function pushMyLocation(
  supabase: SupabaseClient,
  lat: number,
  lng: number,
  heading: number | null
): Promise<void> {
  const { error } = await supabase.rpc("upsert_my_location", {
    p_lat: lat,
    p_lng: lng,
    p_heading: heading,
  });
  if (error) throw toPickupError(error);
}