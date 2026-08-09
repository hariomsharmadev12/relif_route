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

      // TEMP: cross-check this id/email against the one logged from
      // upload-view.tsx's insert — remove once the two bugs are confirmed
      // fixed.
      console.log("Dashboard loaded as:", user.id, user.email);

      const label =
        (user.user_metadata?.full_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Donor";
      setDonorName(label);

      const { data, error } = await supabase
        .from("food_listings")
        .select("*")
        .eq("donor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load listings:", error);
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
