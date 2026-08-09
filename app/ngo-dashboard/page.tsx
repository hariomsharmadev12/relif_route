"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { NgoSidebar } from "@/components/dashboard/ngo-sidebar";
import { NgoDashboardView } from "@/components/dashboard/ngo-dashboard-view";
import { dashboardFontVariables } from "@/components/dashboard/fonts";

export default function NgoDashboardPage() {
  const router = useRouter();
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [orgName, setOrgName] = useState("NGO");

  useEffect(() => {
    async function loadReceiver() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("receivers")
        .select("org_name, full_name")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Failed to load receiver profile:", error);
      } else if (data) {
        setOrgName(data.org_name || data.full_name || "NGO");
      }
    }

    loadReceiver();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    // ⚠️ swap this for your actual NGO/receiver login route if it's named differently
    router.push("/ngo-login");
  }

  return (
    <div className={`min-h-screen bg-[#F5F6F3] ${dashboardFontVariables}`}>
      <NgoSidebar orgName={orgName} onSignOut={handleSignOut} />

      <main className="lg:pl-72">
        <NgoDashboardView />
      </main>
    </div>
  );
}
