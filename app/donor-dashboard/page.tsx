"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DashboardSidebar,
  type DashboardTab,
} from "@/components/dashboard/sidebar";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { UploadView } from "@/components/dashboard/upload-view";
import { dashboardFontVariables } from "@/components/dashboard/fonts";
import {
  mapRowToListing,
  type FoodListing,
} from "@/components/dashboard/types";

export default function DonorDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [donorName, setDonorName] = useState("Donor");

  useEffect(() => {
    async function loadDonorAndListings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoadingListings(false);
        return;
      }

      const label =
        (user.user_metadata?.full_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Donor";
      setDonorName(label);

      // donors.id (what food_listings.donor_id actually references) is
      // NOT the same value as the auth user id — donors.user_id is what
      // links to auth. Resolve the donor's own row id first, same fix as
      // the insert side in upload-view.tsx.
      const { data: donorRow, error: donorError } = await supabase
        .from("donors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (donorError) {
        console.error(
          "Failed to load donor profile:",
          donorError.message,
          donorError.code,
        );
        setIsLoadingListings(false);
        return;
      }

      if (!donorRow) {
        console.warn(
          `No donors row for user ${user.id} (${user.email}) — no listings to show.`,
        );
        setIsLoadingListings(false);
        return;
      }

      const { data, error } = await supabase
        .from("food_listings")
        .select("*")
        .eq("donor_id", donorRow.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load listings:", error.message, error.code);
      } else if (data) {
        setListings(data.map(mapRowToListing));
      }
      setIsLoadingListings(false);
    }

    loadDonorAndListings();
  }, [supabase]);

  function handleNewListing(listing: FoodListing) {
    setListings((prev) => [listing, ...prev]);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/donor-login");
  }

  return (
    <div className={`min-h-screen bg-[#F5F6F3] ${dashboardFontVariables}`}>
      <DashboardSidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        donorName={donorName}
        onSignOut={handleSignOut}
      />

      <main className="lg:pl-72">
        {activeTab === "dashboard" ? (
          <DashboardView
            listings={listings}
            isLoading={isLoadingListings}
            donorFirstName={donorName.split(" ")[0]}
            onUploadMore={() => setActiveTab("uploads")}
          />
        ) : (
          <UploadView
            listings={listings}
            isLoading={isLoadingListings}
            onSubmitted={handleNewListing}
          />
        )}
      </main>
    </div>
  );
}