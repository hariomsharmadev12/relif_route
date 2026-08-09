"use client";

import {
  Package,
  Clock3,
  CheckCircle2,
  Plus,
  Sprout,
  Loader2,
} from "lucide-react";
import type { FoodListing } from "./types";
import { FoodCard } from "./food-card";
import { StatCard } from "./stat-card";
import { getFreshness } from "./time-utils";

interface DashboardViewProps {
  listings: FoodListing[];
  isLoading?: boolean;
  donorFirstName: string;
  onUploadMore: () => void;
}

export function DashboardView({
  listings,
  isLoading = false,
  donorFirstName,
  onUploadMore,
}: DashboardViewProps) {
  const now = new Date();
  const active = listings.filter((l) => l.status === "available");
  const expiringSoon = active.filter(
    (l) => getFreshness(l.createdAt, l.goodUntil, now).urgency === "soon",
  );
  const pickedUp = listings.filter((l) => l.status === "picked_up");

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#7C8B81]">
            Welcome back
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-dashboard-display)] text-[32px] leading-tight text-[#14231C]">
            {donorFirstName}&apos;s dashboard
          </h1>
        </div>
        <button
          type="button"
          onClick={onUploadMore}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-[#1F6B4C] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#195A3F] sm:self-auto"
        >
          <Plus size={17} /> Upload more food
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Package}
          label="Active listings"
          value={active.length}
          accent="green"
        />
        <StatCard
          icon={Clock3}
          label="Expiring within 90 min"
          value={expiringSoon.length}
          accent="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Picked up"
          value={pickedUp.length}
          accent="neutral"
        />
      </div>

      <div className="mt-10">
        <h2 className="font-[family-name:var(--font-dashboard-display)] text-[20px] text-[#14231C]">
          Your listings
        </h2>

        {isLoading ? (
          <LoadingState />
        ) : listings.length === 0 ? (
          <EmptyState onUploadMore={onUploadMore} />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-[#E7E9E4] bg-white/60 px-6 py-14 text-center">
      <Loader2 size={20} className="animate-spin text-[#1F6B4C]" />
      <p className="text-[14px] text-[#5B675F]">Loading your listings…</p>
    </div>
  );
}

function EmptyState({ onUploadMore }: { onUploadMore: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#D5DAD1] bg-white/60 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F1EB] text-[#1F6B4C]">
        <Sprout size={20} />
      </span>
      <p className="font-[family-name:var(--font-dashboard-display)] text-[18px] text-[#14231C]">
        No food listed yet
      </p>
      <p className="max-w-sm text-[14px] text-[#5B675F]">
        List your first batch of surplus food so a nearby volunteer can pick it
        up before it goes to waste.
      </p>
      <button
        type="button"
        onClick={onUploadMore}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#1F6B4C] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#195A3F]"
      >
        <Plus size={16} /> Upload food
      </button>
    </div>
  );
}
