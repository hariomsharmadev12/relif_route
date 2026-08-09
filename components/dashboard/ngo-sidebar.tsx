"use client";

import { useState } from "react";
import { LogOut, Menu, X, Sprout, HeartHandshake } from "lucide-react";

interface NgoSidebarProps {
  orgName: string;
  onSignOut?: () => void;
}

export function NgoSidebar({ orgName, onSignOut }: NgoSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = orgName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-[#22332A] bg-[#12201A] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 text-white">
          <Sprout size={20} className="text-[#5FAE84]" />
          <span className="font-[family-name:var(--font-dashboard-display)] text-lg">
            Relief Route
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-white hover:bg-white/10"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="flex items-center gap-3 border-b border-[#22332A] bg-[#12201A] px-4 py-4 lg:hidden">
          <HeartHandshake size={18} className="text-[#5FAE84]" />
          <span className="text-[14px] text-[#AEBBB2]">
            Signed in as {orgName}
          </span>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-[#22332A] lg:bg-[#12201A]">
        <div className="flex items-center gap-2.5 px-6 py-7">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F6B4C]">
            <Sprout size={18} className="text-white" />
          </span>
          <div>
            <p className="font-[family-name:var(--font-dashboard-display)] text-[19px] leading-none text-white">
              Relief Route
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#7C8B81]">
              NGO account
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#1F6B4C] px-4 py-3 text-[15px] font-medium text-white">
            <HeartHandshake size={19} strokeWidth={2} />
            Donations
          </div>
        </div>

        <div className="border-t border-[#22332A] px-3 py-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F6B4C] text-[13px] font-semibold text-white">
              {initials || "N"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-white">
                {orgName}
              </p>
              <p className="truncate text-[12px] text-[#7C8B81]">NGO</p>
            </div>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                className="shrink-0 rounded-lg p-2 text-[#7C8B81] hover:bg-white/5 hover:text-white"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
