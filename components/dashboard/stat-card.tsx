import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  accent: "green" | "amber" | "neutral";
}

const ACCENTS = {
  green: "bg-[#E6F1EB] text-[#1F6B4C]",
  amber: "bg-[#FCF0DA] text-[#B5750B]",
  neutral: "bg-[#EEF1EC] text-[#3E4A43]",
};

export function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E7E9E4] bg-white p-5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ACCENTS[accent]}`}
      >
        <Icon size={20} />
      </span>
      <div>
        <p className="font-[family-name:var(--font-dashboard-display)] text-[26px] leading-none text-[#14231C]">
          {value}
        </p>
        <p className="mt-1.5 text-[13px] text-[#5B675F]">{label}</p>
      </div>
    </div>
  );
}
