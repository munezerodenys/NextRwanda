"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import IndicatorTable, { type Indicator } from "@/components/sectors/indicator-table";

type SectorResponse = {
  sector: string;
  description?: string;
  indicators: Indicator[];
};

type SectorPageProps = {
  sector: "Education" | "Health" | "Employment";
  endpoint: string;
  summary: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function SectorPage({ sector, endpoint, summary }: SectorPageProps) {
  const router = useRouter();
  const [data, setData] = useState<SectorResponse | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("nexrwanda_access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${apiUrl}/api/v1/${endpoint}/indicators`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("nexrwanda_access_token");
          router.replace("/login");
          return null;
        }
        if (!response.ok) throw new Error(`${sector} data is currently unavailable.`);
        return response.json();
      })
      .then((responseData) => {
        if (responseData) {
          setError("");
          setData(responseData);
        }
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load sector data."));
  }, [endpoint, router, sector, attempt]);

  function signOut() {
    localStorage.removeItem("nexrwanda_access_token");
    router.push("/login");
  }

  const loading = !data && !error;
  const sourceCount = data ? new Set(data.indicators.map((item) => item.data_source)).size : null;
  const frameworkCount = data ? new Set(data.indicators.map((item) => item.framework)).size : null;

  return (
    <DashboardShell title={`${sector} Development`} subtitle="Data, insights, and development priorities" onSignOut={signOut}>
      <p className="max-w-3xl text-[15px] leading-7 text-[#64748B]">{data?.description ?? summary}</p>

      {error && (
        <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>{error}</span>
          <button
            onClick={() => setAttempt((value) => value + 1)}
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 font-medium hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label={`${sector} indicators`} value={data?.indicators.length} loading={loading} />
        <KpiCard label="Data sources" value={sourceCount} loading={loading} />
        <KpiCard label="Frameworks" value={frameworkCount} loading={loading} />
      </div>

      <div className="mt-6">
        {data ? (
          <IndicatorTable indicators={data.indicators} />
        ) : loading ? (
          <div className="space-y-3 rounded-lg border border-[#E2E8F0] bg-white p-5" aria-busy="true">
            {[0, 1, 2, 3].map((key) => <div key={key} className="h-12 animate-pulse rounded bg-[#E2E8F0]" />)}
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
