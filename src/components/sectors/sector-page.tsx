"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Indicator = {
  id: number;
  name: string;
  description: string | null;
  unit: string | null;
  data_source: string;
  framework: string;
};

type SectorResponse = {
  sector: string;
  description?: string;
  indicators: Indicator[];
};

type SectorPageProps = {
  sector: "Education" | "Health" | "Employment";
  endpoint: string;
  accent: string;
  summary: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function SectorPage({ sector, endpoint, accent, summary }: SectorPageProps) {
  const router = useRouter();
  const [data, setData] = useState<SectorResponse | null>(null);
  const [error, setError] = useState("");

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
      .then((responseData) => responseData && setData(responseData))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load sector data."));
  }, [endpoint, router, sector]);

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#17211b]">
      <header className="border-b border-[#d8d1c3] bg-[#fbfaf6]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <Link className="text-sm font-semibold uppercase tracking-[0.22em] text-[#23695b]" href="/dashboard">NexRwanda</Link>
          <nav className="flex gap-5 text-sm font-medium text-[#667267]">
            <Link className="hover:text-[#23695b]" href="/dashboard">Overview</Link>
            <Link className="hover:text-[#23695b]" href="/education">Education</Link>
            <Link className="hover:text-[#23695b]" href="/health">Health</Link>
            <Link className="hover:text-[#23695b]" href="/employment">Employment</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{sector} sector</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">{sector}</h1>
          <p className="mt-4 text-lg leading-8 text-[#667267]">{data?.description ?? summary}</p>
        </div>
        {error && <div className="mt-8 border border-[#e6b9ab] bg-[#fff3ef] px-4 py-3 text-sm text-[#9b3d2c]">{error}</div>}
        <div className="mt-10 flex items-end justify-between border-b border-[#cfc9bd] pb-4">
          <div><p className="text-sm uppercase tracking-[0.18em] text-[#758174]">Indicator library</p><h2 className="mt-2 text-2xl font-semibold">Evidence to explore</h2></div>
          <p className="text-sm text-[#758174]">{data ? `${data.indicators.length} indicators` : "Loading..."}</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.indicators.map((indicator) => <article className="border border-[#d8d1c3] bg-[#fbfaf6] p-6" key={indicator.id}><div className="flex items-start justify-between gap-4"><h3 className="text-lg font-semibold leading-7">{indicator.name}</h3><span className="shrink-0 bg-[#e6eddb] px-2 py-1 text-xs font-semibold text-[#23695b]">{indicator.unit ?? "-"}</span></div><p className="mt-3 min-h-14 text-sm leading-6 text-[#667267]">{indicator.description ?? "No description available."}</p><div className="mt-6 flex justify-between border-t border-[#e4ded2] pt-4 text-xs uppercase tracking-[0.12em] text-[#758174]"><span>{indicator.data_source}</span><span>{indicator.framework}</span></div></article>)}
        </div>
        {!data && !error && <p className="mt-8 text-sm text-[#758174]">Loading indicators...</p>}
        {data?.indicators.length === 0 && <p className="mt-8 border border-dashed border-[#cfc9bd] p-8 text-center text-[#758174]">No indicators have been added for this sector yet.</p>}
      </div>
    </main>
  );
}