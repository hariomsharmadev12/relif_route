/* -------------------------------------------------------------------- */
/*  Types                                                                */
/* -------------------------------------------------------------------- */

export type FoodStatus = "available" | "accepted" | "picked_up" | "expired";

export interface FoodListing {
  id: string;
  photoUrl: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  pickupAddress: string;
  latitude: number | null;
  longitude: number | null;
  goodUntil: string; // ISO datetime string
  createdAt: string; // ISO datetime string
  status: FoodStatus;
  acceptedByReceiverId: string | null;
  acceptedByName: string | null;
  acceptedByPhone: string | null;
  acceptedAt: string | null; // ISO datetime string
}

export const FOOD_UNITS = [
  "servings",
  "plates",
  "kg",
  "boxes",
  "packets",
] as const;

export type FoodUnit = (typeof FOOD_UNITS)[number];

/** Shape of a row as it comes back from `food_listings` in Supabase. */
export interface FoodListingRow {
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
  status: FoodStatus;
  created_at: string;
  accepted_by_receiver_id: string | null;
  accepted_by_name: string | null;
  accepted_by_phone: string | null;
  accepted_at: string | null;
}

/** Converts a Supabase row (snake_case) into the FoodListing the UI uses. */
export function mapRowToListing(row: FoodListingRow): FoodListing {
  return {
    id: row.id,
    photoUrl: row.photo_url,
    name: row.name,
    quantity: Number(row.quantity),
    unit: row.unit as FoodUnit,
    pickupAddress: row.pickup_address,
    latitude: row.latitude,
    longitude: row.longitude,
    goodUntil: row.good_until,
    createdAt: row.created_at,
    status: row.status,
    acceptedByReceiverId: row.accepted_by_receiver_id,
    acceptedByName: row.accepted_by_name,
    acceptedByPhone: row.accepted_by_phone,
    acceptedAt: row.accepted_at,
  };
}

/* -------------------------------------------------------------------- */
/*  NGO (receiver) side                                                  */
/* -------------------------------------------------------------------- */

/** Shape of a row as it comes back from `donors` in Supabase. */
export interface DonorRow {
  user_id: string;
  donor_type: "individual" | "restaurant";
  full_name: string | null;
  restaurant_name: string | null;
  contact_person: string | null;
  email: string;
  phone: string | null;
  address: string | null;
}

export interface DonorInfo {
  donorType: "individual" | "restaurant";
  fullName: string | null;
  restaurantName: string | null;
  contactPerson: string | null;
  email: string;
  phone: string | null;
  address: string | null;
}

export function mapRowToDonorInfo(row: DonorRow): DonorInfo {
  return {
    donorType: row.donor_type,
    fullName: row.full_name,
    restaurantName: row.restaurant_name,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    address: row.address,
  };
}

/** A listing enriched with the donor's contact details — used on the NGO dashboard. */
export interface NgoFoodListing extends FoodListing {
  donorId: string;
  donor: DonorInfo | null;
}

export function mapRowToNgoListing(
  row: FoodListingRow,
  donor: DonorInfo | null,
): NgoFoodListing {
  return {
    ...mapRowToListing(row),
    donorId: row.donor_id,
    donor,
  };
}

/** The signed-in NGO/receiver's own profile. */
export interface ReceiverProfile {
  id: string;
  receiverType: "ngo" | "individual";
  orgName: string | null;
  fullName: string | null;
  phone: string | null;
}
