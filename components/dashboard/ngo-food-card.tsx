"use client";

import { Building2, MapPin, Phone, User2, CheckCircle2, X } from "lucide-react";
import type { NgoFoodListing } from "./types";
import { getFreshness, URGENCY_COLORS } from "./time-utils";

interface NgoFoodCardProps {
  listing: NgoFoodListing;
  onAccept: (listingId: string) => void;
  onDecline: (listingId: string) => void;
  isBusy?: boolean; // true while an accept/decline request for this card is in flight
}

export function NgoFoodCard({
  listing,
  onAccept,
  onDecline,
  isBusy = false,
}: NgoFoodCardProps) {
  const { urgency, label } = getFreshness(
    listing.createdAt,
    listing.goodUntil,
    new Date(),
  );
  const colors = URGENCY_COLORS[urgency];
  const isPending = listing.status === "available";

  // Added aggressive fallbacks to prevent "Not provided"
  const donorName =
    listing.donor?.donorType === "restaurant"
      ? listing.donor?.restaurantName ||
        listing.donor?.contactPerson ||
        listing.donor?.email?.split("@")[0]
      : listing.donor?.fullName || listing.donor?.email?.split("@")[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E7E9E4] bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(20,30,24,0.18)]">
      <div className="relative h-40 w-full overflow-hidden bg-[#EEF1EC]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.photoUrl}
          alt={listing.name}
          className="h-full w-full object-cover"
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${colors.badgeBg} ${colors.badgeText}`}
        >
          {isPending ? label : "Accepted by you"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[family-name:var(--font-dashboard-display)] text-[17px] leading-tight text-[#14231C]">
            {listing.name}
          </h3>
          <span className="shrink-0 font-[family-name:var(--font-dashboard-mono)] text-[13px] text-[#5B675F]">
            {listing.quantity} {listing.unit}
          </span>
        </div>

        <div className="flex items-start gap-1.5 text-[13px] text-[#5B675F]">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{listing.pickupAddress}</span>
        </div>

        <div className="rounded-xl border border-[#E7E9E4] bg-[#F7F8F5] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C8B81]">
            Donor
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#14231C]">
            {listing.donor?.donorType === "restaurant" ? (
              <Building2 size={14} className="shrink-0 text-[#5B675F]" />
            ) : (
              <User2 size={14} className="shrink-0 text-[#5B675F]" />
            )}
            <span className="font-medium">{donorName || "Not provided"}</span>
          </div>
          {listing.donor?.phone && (
            <a
              href={`tel:${listing.donor.phone}`}
              className="mt-1 flex items-center gap-1.5 text-[13px] text-[#1F6B4C] hover:underline"
            >
              <Phone size={13} /> {listing.donor.phone}
            </a>
          )}
        </div>

        <div className="mt-auto pt-1.5">
          {isPending ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onAccept(listing.id)}
                disabled={isBusy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1F6B4C] px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#195A3F] disabled:opacity-60"
              >
                <CheckCircle2 size={15} /> Accept
              </button>
              <button
                type="button"
                onClick={() => onDecline(listing.id)}
                disabled={isBusy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#D5DAD1] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#5B675F] transition-colors hover:border-[#D64545] hover:text-[#D64545] disabled:opacity-60"
              >
                <X size={15} /> Decline
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1EB] px-2.5 py-1.5 text-[12px] font-medium text-[#1F6B4C]">
              <CheckCircle2 size={13} /> You accepted this
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
