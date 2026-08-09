"use client";

import { useEffect, useState } from "react";
// Added Building2 and Phone imports to display the NGO data
import { MapPin, CheckCircle2, Building2, Phone } from "lucide-react";
import type { FoodListing } from "./types";
import { getFreshness, URGENCY_COLORS } from "./time-utils";

interface FoodCardProps {
  listing: FoodListing;
}

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FoodCard({ listing }: FoodCardProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const pickedUp = listing.status === "picked_up";
  const { urgency, label, percentRemaining } = getFreshness(
    listing.createdAt,
    listing.goodUntil,
    now,
  );
  const colors = URGENCY_COLORS[urgency];
  const dashOffset = CIRCUMFERENCE * (1 - percentRemaining / 100);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E7E9E4] bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(20,30,24,0.18)]">
      <div className="relative h-40 w-full overflow-hidden bg-[#EEF1EC]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.photoUrl}
          alt={listing.name}
          className="h-full w-full object-cover"
        />

        {pickedUp ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-medium text-[#1F6B4C] shadow-sm">
            <CheckCircle2 size={13} /> Picked up
          </span>
        ) : (
          <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              className="-rotate-90"
            >
              <circle
                cx="22"
                cy="22"
                r={RADIUS}
                fill="rgba(18,32,26,0.55)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
              />
              <circle
                cx="22"
                cy="22"
                r={RADIUS}
                fill="none"
                stroke={colors.ring}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <span className="absolute font-[family-name:var(--font-dashboard-mono)] text-[9px] font-medium text-white">
              {urgency === "expired" ? "0%" : `${percentRemaining}%`}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
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

        {/* --- NEW SECTION: Display NGO details once accepted --- */}
        {(listing.status === "accepted" || listing.status === "picked_up") &&
          listing.acceptedByName && (
            <div className="mt-2 rounded-xl border border-[#E7E9E4] bg-[#F7F8F5] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C8B81]">
                Accepted By
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#14231C]">
                <Building2 size={14} className="shrink-0 text-[#5B675F]" />
                <span className="font-medium">{listing.acceptedByName}</span>
              </div>
              {listing.acceptedByPhone && (
                <a
                  href={`tel:${listing.acceptedByPhone}`}
                  className="mt-1 flex items-center gap-1.5 text-[13px] text-[#1F6B4C] hover:underline"
                >
                  <Phone size={13} /> {listing.acceptedByPhone}
                </a>
              )}
            </div>
          )}

        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${colors.badgeBg} ${colors.badgeText}`}
          >
            {pickedUp ? "Collected" : label}
          </span>
        </div>
      </div>
    </article>
  );
}
