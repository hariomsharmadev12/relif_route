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

  // --- Food details ------------------------------------------------------
  category: FoodCategory;
  dietType: DietType;
  servesCount: number | null;
  ingredientsAllergens: string | null;

  // --- Preparation & storage ----------------------------------------------
  preparationType: PreparationType;
  preparedAt: string | null; // ISO datetime string
  storageMethod: StorageMethod;
  storageMethodOther: string | null;
  currentTempCelsius: number | null;
  storageDurationHours: number | null;
  safetyConcerns: SafetyConcern[];

  // Auto-captured at submit time, not user-entered.
  reportedAt: string; // ISO datetime string
}

export const FOOD_UNITS = [
  "servings",
  "plates",
  "kg",
  "boxes",
  "packets",
] as const;

export type FoodUnit = (typeof FOOD_UNITS)[number];

/* -------------------------------------------------------------------- */
/*  Food details                                                        */
/* -------------------------------------------------------------------- */

export const FOOD_CATEGORIES = [
  { value: "cooked_meal", label: "Cooked meal" },
  { value: "bakery", label: "Bakery" },
  { value: "produce", label: "Fruits & vegetables" },
  { value: "packaged_snacks", label: "Packaged snacks" },
  { value: "dairy", label: "Dairy" },
  { value: "beverages", label: "Beverages" },
] as const satisfies { value: string; label: string }[];

export type FoodCategory = (typeof FOOD_CATEGORIES)[number]["value"];

export const DIET_TYPES = [
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non-veg" },
  { value: "vegan", label: "Vegan" },
] as const satisfies { value: string; label: string }[];

export type DietType = (typeof DIET_TYPES)[number]["value"];

/* -------------------------------------------------------------------- */
/*  Preparation & storage                                               */
/* -------------------------------------------------------------------- */

export type PreparationType = "fresh" | "packaged";

// "hot_holding" only makes sense for freshly prepared food, and "frozen"
// only for packaged food — the two option sets intentionally diverge.
export const STORAGE_METHODS_FRESH = [
  { value: "room_temperature", label: "Room temperature" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "hot_holding", label: "Hot holding" },
  { value: "other", label: "Other" },
] as const satisfies { value: string; label: string }[];

export const STORAGE_METHODS_PACKAGED = [
  { value: "room_temperature", label: "Room temperature" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "frozen", label: "Frozen" },
  { value: "other", label: "Other" },
] as const satisfies { value: string; label: string }[];

export type StorageMethod =
  | (typeof STORAGE_METHODS_FRESH)[number]["value"]
  | (typeof STORAGE_METHODS_PACKAGED)[number]["value"];

export const SAFETY_CONCERNS_FRESH = [
  { value: "left_out_long", label: "Left out over 2 hrs" },
  { value: "not_reheated", label: "Not reheated before storing" },
  { value: "odor_discoloration", label: "Odor or discoloration" },
] as const satisfies { value: string; label: string }[];

export const SAFETY_CONCERNS_PACKAGED = [
  { value: "packaging_damaged", label: "Packaging damaged" },
  { value: "seal_broken", label: "Seal broken" },
  { value: "near_expiry", label: "Near expiry date" },
  { value: "odor_discoloration", label: "Odor or discoloration" },
] as const satisfies { value: string; label: string }[];

export type SafetyConcern =
  | (typeof SAFETY_CONCERNS_FRESH)[number]["value"]
  | (typeof SAFETY_CONCERNS_PACKAGED)[number]["value"];

// Combined, de-duplicated lookup — a listing's preparationType isn't known
// at every call site (e.g. FoodCard just has the flagged values), so this
// covers concerns from either path.
const ALL_SAFETY_CONCERNS = [
  ...SAFETY_CONCERNS_FRESH,
  ...SAFETY_CONCERNS_PACKAGED,
].filter(
  (concern, index, all) =>
    all.findIndex((c) => c.value === concern.value) === index,
);

export function getSafetyConcernLabel(value: SafetyConcern): string {
  return ALL_SAFETY_CONCERNS.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryLabel(value: FoodCategory): string {
  return FOOD_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getDietLabel(value: DietType): string {
  return DIET_TYPES.find((d) => d.value === value)?.label ?? value;
}

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

  category: FoodCategory;
  diet_type: DietType;
  serves_count: number | null;
  ingredients_allergens: string | null;

  preparation_type: PreparationType;
  prepared_at: string | null;
  storage_method: StorageMethod;
  storage_method_other: string | null;
  current_temp_celsius: number | null;
  storage_duration_hours: number | null;
  safety_concerns: SafetyConcern[];

  reported_at: string;
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

    category: row.category,
    dietType: row.diet_type,
    servesCount: row.serves_count !== null ? Number(row.serves_count) : null,
    ingredientsAllergens: row.ingredients_allergens,

    preparationType: row.preparation_type,
    preparedAt: row.prepared_at,
    storageMethod: row.storage_method,
    storageMethodOther: row.storage_method_other,
    currentTempCelsius:
      row.current_temp_celsius !== null ? Number(row.current_temp_celsius) : null,
    storageDurationHours:
      row.storage_duration_hours !== null
        ? Number(row.storage_duration_hours)
        : null,
    safetyConcerns: row.safety_concerns ?? [],

    reportedAt: row.reported_at,
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
/* -------------------------------------------------------------------- */
/*  Donor side                                                          */
/* -------------------------------------------------------------------- */

/** Shape of a row as it comes back from `receivers` in Supabase. */
export interface ReceiverRow {
  id: string;
  receiver_type: "ngo" | "individual";
  org_name: string | null;
  full_name: string | null;
  phone: string | null;
}

export interface ReceiverInfo {
  receiverType: "ngo" | "individual";
  orgName: string | null;
  fullName: string | null;
  phone: string | null;
}

export function mapRowToReceiverInfo(row: ReceiverRow): ReceiverInfo {
  return {
    receiverType: row.receiver_type,
    orgName: row.org_name,
    fullName: row.full_name,
    phone: row.phone,
  };
}

/** A listing enriched with the accepting receiver's contact details — used on the donor dashboard. */
export interface DonorFoodListing extends FoodListing {
  receiver: ReceiverInfo | null;
}

export function mapRowToDonorListing(
  row: FoodListingRow,
  receiver: ReceiverInfo | null,
): DonorFoodListing {
  return {
    ...mapRowToListing(row),
    receiver,
  };
}

/** Shape of a row as it comes back from `receiver_locations` in Supabase. */
export interface ReceiverLocationRow {
  receiver_id: string;
  lat: number;
  lng: number;
  heading: number | null;
  updated_at: string;
}

export interface ReceiverLocation {
  receiverId: string;
  lat: number;
  lng: number;
  heading: number | null;
  updatedAt: string;
}

export function mapRowToReceiverLocation(row: ReceiverLocationRow): ReceiverLocation {
  return {
    receiverId: row.receiver_id,
    lat: row.lat,
    lng: row.lng,
    heading: row.heading,
    updatedAt: row.updated_at,
  };
}