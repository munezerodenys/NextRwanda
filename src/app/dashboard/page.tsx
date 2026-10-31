"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import SectorCoverage from "@/components/dashboard/SectorCoverage";
import SourcesPanel from "@/components/dashboard/SourcesPanel";
import VerificationPanel from "@/components/dashboard/VerificationPanel";
import type { Summary } from "@/components/dashboard/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "nexrwanda_access_token";

function sectorCount(summary: Summary | null, keyword: string): number | null {
  if (!summary) return null;
  const match = summary.sector_data.find((sector) => sector.name.toLowerCase().includes(keyword));
  return match ? match.indicators : null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/login");
      return;
    }
    setError("");
    fetch(`${apiUrl}/api/v1/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          router.replace("/login");
          return null;
        }
        if (!response.ok) throw new Error("Dashboard data is currently unavailable.");
        return response.json();
      })
      .then((data) => data && setSummary(data))
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "Dashboard data is currently unavailable."),
      );
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load, attempt]);

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/login");
  }

  const loading = !summary && !error;
  const pending = summary ? Math.max(summary.measurements - summary.verified_measurements, 0) : null;

  return (
    <DashboardShell title="Development Overview" subtitle="Data, insights, and development priorities" onSignOut={signOut}>
      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>{error}</span>
          <button
            onClick={() => setAttempt((value) => value + 1)}
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 font-medium hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total indicators" value={summary?.indicators} loading={loading} />
        <KpiCard label="Education indicators" value={sectorCount(summary, "educ")} loading={loading} />
        <KpiCard label="Health indicators" value={sectorCount(summary, "health")} loading={loading} />
        <KpiCard label="Employment indicators" value={sectorCount(summary, "employ")} loading={loading} />
        <KpiCard label="Verified measurements" value={summary?.verified_measurements} loading={loading} tone="verified" />
        <KpiCard label="Pending verification" value={pending} loading={loading} tone="pending" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectorCoverage sectors={summary?.sector_data} latestYear={summary?.latest_reporting_year} />
        </div>
        <VerificationPanel total={summary?.measurements ?? 0} verified={summary?.verified_measurements ?? 0} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <SourcesPanel title="Data sources" items={summary?.data_sources} empty="No data sources recorded yet." />
        <SourcesPanel title="Frameworks" items={summary?.frameworks} empty="No frameworks recorded yet." />
      </div>
    </DashboardShell>
  );
}