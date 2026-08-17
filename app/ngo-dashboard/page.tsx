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
  const [checkingReceiver, setCheckingReceiver] = useState(true);

  useEffect(() => {
    async function loadReceiver() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/volunteer-login"); // not signed in at all
        return;
      }

      // maybeSingle() (not single()) — a signed-in user with no receivers
      // row (e.g. a donor account landing here by mistake, or a receiver
      // signup that never finished) is a real, expected case, not an
      // error condition. single() would throw on exactly that case.
      const { data, error } = await supabase
        .from("receivers")
        .select("org_name, full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        // Log the actual fields — the object itself sometimes prints as
        // {} in Next's dev overlay even though these fields are real.
        console.error(
          "Failed to load receiver profile:",
          error.message,
          error.code,
          error.details,
        );
        setCheckingReceiver(false);
        return;
      }

      if (!data) {
        // Signed in, but no matching receivers row — most likely this
        // account is a donor, or receiver signup didn't finish.
        console.warn(
          `No receivers row for user ${user.id} (${user.email}) — redirecting.`,
        );
        router.push("/"); // adjust to wherever makes sense for your app
        return;
      }

      setOrgName(data.org_name || data.full_name || "NGO");
      setCheckingReceiver(false);
    }

    loadReceiver();
  }, [supabase, router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/volunteer-login");
  }

  if (checkingReceiver) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F3]">
        <p className="text-[14px] text-[#5B675F]">Loading…</p>
      </div>
    );
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