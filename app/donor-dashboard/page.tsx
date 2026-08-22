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
  mapRowToDonorListing,
  mapRowToReceiverInfo,
  type DonorFoodListing,
  type ReceiverInfo,
} from "@/components/dashboard/types";

export default function DonorDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [listings, setListings] = useState<DonorFoodListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [donorName, setDonorName] = useState("Donor");

  useEffect(() => {
    loadDonorAndListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Light poll while a delivery is in flight, so the map on the dashboard
  // clears out shortly after the rider marks it picked up — no Realtime
  // subscription required for that.
  useEffect(() => {
    const hasActiveDelivery = listings.some((l) => l.status === "accepted");
    if (!hasActiveDelivery) return;
    const intervalId = setInterval(loadDonorAndListings, 15000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

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

    // donors.id (what food_listings.donor_id actually references) is NOT
    // the same value as the auth user id — donors.user_id is what links
    // to auth. Resolve the donor's own row id first, same fix as the
    // insert side in upload-view.tsx.
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

    const { data: listingRows, error: listingsError } = await supabase
      .from("food_listings")
      .select("*")
      .eq("donor_id", donorRow.id)
      .order("created_at", { ascending: false });

    if (listingsError) {
      console.error(
        "Failed to load listings:",
        listingsError.message,
        listingsError.code,
      );
      setIsLoadingListings(false);
      return;
    }

    const rows = listingRows ?? [];

    // Separate query rather than a `.select` embed — there's no FK
    // relationship set up between food_listings and receivers to embed on.
    const receiverIds = Array.from(
      new Set(
        rows
          .map((r) => r.accepted_by_receiver_id)
          .filter((id): id is string => id != null),
      ),
    );

    let receiversById = new Map<string, ReceiverInfo>();
    if (receiverIds.length > 0) {
      const { data: receiverRows, error: receiversError } = await supabase
        .from("receivers")
        .select("id, receiver_type, org_name, full_name, phone")
        .in("id", receiverIds);

      if (receiversError) {
        console.error("Failed to load receiver info:", receiversError.message);
      } else {
        receiversById = new Map(
          (receiverRows ?? []).map((r) => [r.id, mapRowToReceiverInfo(r)]),
        );
      }
    }

    setListings(
      rows.map((row) =>
        mapRowToDonorListing(
          row,
          row.accepted_by_receiver_id
            ? receiversById.get(row.accepted_by_receiver_id) ?? null
            : null,
        ),
      ),
    );
    setIsLoadingListings(false);
  }

  function handleNewListing(listing: DonorFoodListing) {
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