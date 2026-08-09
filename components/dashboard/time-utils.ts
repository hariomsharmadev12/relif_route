/* -------------------------------------------------------------------- */
/*  Freshness helpers                                                    */
/*  Every listing's urgency is derived live from `goodUntil`, so the     */
/*  UI never needs a separate "expired" flag to fall out of sync.        */
/* -------------------------------------------------------------------- */

export type Urgency = "fresh" | "soon" | "expired";

export interface Freshness {
  urgency: Urgency;
  label: string; // e.g. "3h 20m left"
  percentRemaining: number; // 0-100, clamped
}

export function getFreshness(
  createdAt: string,
  goodUntil: string,
  now: Date = new Date(),
): Freshness {
  const start = new Date(createdAt).getTime();
  const end = new Date(goodUntil).getTime();
  const current = now.getTime();

  const totalWindow = Math.max(end - start, 1);
  const remainingMs = end - current;
  const percentRemaining = Math.min(
    100,
    Math.max(0, Math.round((remainingMs / totalWindow) * 100)),
  );

  if (remainingMs <= 0) {
    return { urgency: "expired", label: "Expired", percentRemaining: 0 };
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const label = hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;

  const urgency: Urgency = remainingMs <= 90 * 60 * 1000 ? "soon" : "fresh";

  return { urgency, label, percentRemaining };
}

export const URGENCY_COLORS: Record<
  Urgency,
  { ring: string; text: string; badgeBg: string; badgeText: string }
> = {
  fresh: {
    ring: "#1F6B4C",
    text: "text-[#1F6B4C]",
    badgeBg: "bg-[#E6F1EB]",
    badgeText: "text-[#1F6B4C]",
  },
  soon: {
    ring: "#E8A33D",
    text: "text-[#B5750B]",
    badgeBg: "bg-[#FCF0DA]",
    badgeText: "text-[#B5750B]",
  },
  expired: {
    ring: "#D64545",
    text: "text-[#D64545]",
    badgeBg: "bg-[#FBE7E7]",
    badgeText: "text-[#D64545]",
  },
};
