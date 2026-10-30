"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Summary = {
  sectors: number;
  indicators: number;
  measurements: number;
  verified_measurements: number;
  latest_reporting_year: number | null;
  data_sources: string[];
  frameworks: string[];
  sector_data: { id: number; name: string; description: string | null; indicators: number }[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("nexrwanda_access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${apiUrl}/api/v1/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("nexrwanda_access_token");
          router.replace("/login");
          return null;
        }
        if (!response.ok) throw new Error("Dashboard data is currently unavailable.");
        return response.json();
      })
      .then((data) => data && setSummary(data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Dashboard data is currently unavailable."));
  }, [router]);

  function signOut() {
    localStorage.removeItem("nexrwanda_access_token");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#17211b]">
      <header className="border-b border-[#d8d1c3] bg-[#fbfaf6]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#23695b]">NexRwanda</p><p className="mt-1 text-sm text-[#758174]">Development intelligence workspace</p></div>
          <nav className="order-3 flex w-full gap-5 text-sm font-medium text-[#667267] md:order-2 md:w-auto"><a className="hover:text-[#23695b]" href="/education">Education</a><a className="hover:text-[#23695b]" href="/health">Health</a><a className="hover:text-[#23695b]" href="/employment">Employment</a><a className="hover:text-[#23695b]" href="/dashboard/innovations">Innovations</a></nav>
          <button className="border border-[#cfc9bd] px-4 py-2 text-sm font-medium transition hover:border-[#23695b]" onClick={signOut}>Sign out</button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d07f3d]">Overview</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">National progress at a glance</h1><p className="mt-3 max-w-2xl text-[#667267]">A single view of the indicators, sectors, and measurements powering the evidence base.</p></div>
        {error && <div className="mb-6 border border-[#e6b9ab] bg-[#fff3ef] px-4 py-3 text-sm text-[#9b3d2c]">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{ label: "Sectors tracked", value: summary?.sectors }, { label: "Indicators", value: summary?.indicators }, { label: "Measurements", value: summary?.measurements }, { label: "Verified measurements", value: summary?.verified_measurements }].map((stat) => <div className="border border-[#d8d1c3] bg-[#fbfaf6] p-6" key={stat.label}><p className="text-sm text-[#758174]">{stat.label}</p><p className="mt-4 text-4xl font-semibold text-[#23695b]">{stat.value ?? "-"}</p></div>)}
        </div>
        <section className="mt-8 border border-[#d8d1c3] bg-[#fbfaf6] p-6 md:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#758174]">Coverage by sector</p><h2 className="mt-2 text-2xl font-semibold">What is being measured</h2></div><p className="text-sm text-[#758174]">Latest reporting year: <span className="font-semibold text-[#17211b]">{summary?.latest_reporting_year ?? "-"}</span></p></div><div className="mt-6 grid gap-3 md:grid-cols-3">{summary?.sector_data.map((sector) => <div className="border-l-4 border-[#d78d4d] bg-[#f4f1e8] p-5" key={sector.id ?? sector.name}><p className="font-semibold">{sector.name}</p><p className="mt-2 text-sm leading-6 text-[#667267]">{sector.description ?? "Sector indicators and measurements."}</p><p className="mt-5 text-2xl font-semibold text-[#23695b]">{sector.indicators}<span className="ml-2 text-sm font-normal text-[#758174]">indicators</span></p></div>) ?? <p className="text-sm text-[#758174]">Loading sector coverage...</p>}</div></section>
      </div>
    </main>
  );
}