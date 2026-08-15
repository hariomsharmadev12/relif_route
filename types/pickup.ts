export type ListingStatus = "available" | "claimed" | "collected" | string;

export interface FoodListing {
  id: string;
  donor_id: string;
  name: string;
  quantity: number;
  unit: string;
  pickup_address: string;
  latitude: number | null;
  longitude: number | null;
  good_until: string;
  photo_url: string;
  status: ListingStatus;
  created_at: string;
  accepted_by_receiver_id: string | null;
  accepted_by_name: string | null;
  accepted_by_phone: string | null;
  accepted_at: string | null;
  collected_at: string | null;
}

/** food_listings joined with the donor fields needed to render the map/list. */
export interface FoodListingWithDonor extends FoodListing {
  donor: {
    id: string;
    full_name: string | null;
    restaurant_name: string | null;
    phone: string | null;
    address: string | null;
  } | null;
}

export interface ReceiverLocation {
  receiver_id: string;
  lat: number;
  lng: number;
  heading: number | null;
  updated_at: string;
}

/** Errors raised by name from the claim_listing / mark_listing_collected RPCs. */
export type PickupErrorCode =
  | "NOT_AUTHENTICATED"
  | "NOT_A_RECEIVER"
  | "RECEIVER_HAS_ACTIVE_TASK"
  | "LISTING_ALREADY_CLAIMED"
  | "NOT_YOUR_ACTIVE_PICKUP";

export class PickupError extends Error {
  code: PickupErrorCode | "UNKNOWN";
  constructor(code: PickupErrorCode | "UNKNOWN", message: string) {
    super(message);
    this.code = code;
    this.name = "PickupError";
  }
}