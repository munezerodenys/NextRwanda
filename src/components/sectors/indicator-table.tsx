"use client";

import { useMemo, useState } from "react";

export type Indicator = {
  id: number;
  name: string;
  description: string | null;
  unit: string | null;
  data_source: string;
  framework: string;
};

const controlClass =
  "h-10 rounded-md border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20";

export default function IndicatorTable({ indicators }: { indicators: Indicator[] }) {
  const [query, setQuery] = useState("");
  const [framework, setFramework] = useState("all");
  const [source, setSource] = useState("all");

  const frameworks = useMemo(() => Array.from(new Set(indicators.map((item) => item.framework))).sort(), [indicators]);
  const sources = useMemo(() => Array.from(new Set(indicators.map((item) => item.data_source))).sort(), [indicators]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return indicators.filter((item) => {
      if (framework !== "all" && item.framework !== framework) return false;
      if (source !== "all" && item.data_source !== source) return false;
      if (!needle) return true;
      return `${item.name} ${item.description ?? ""}`.toLowerCase().includes(needle);
    });
  }, [indicators, query, framework, source]);

  const filtersActive = query !== "" || framework !== "all" || source !== "all";

  function clearFilters() {
    setQuery("");
    setFramework("all");
    setSource("all");
  }

  return (
    <section className="rounded-lg border border-[#E2E8F0] bg-white shadow-sm" aria-labelledby="indicator-library">
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="indicator-library" className="text-base font-semibold">Indicator library</h2>
          <p className="mt-1 text-sm text-[#64748B]" aria-live="polite">
            Showing {filtered.length} of {indicators.length} indicators
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            type="search"
            aria-label="Search indicators"
            placeholder="Search indicators"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`${controlClass} w-full sm:w-56`}
          />
          <select aria-label="Filter by framework" value={framework} onChange={(event) => setFramework(event.target.value)} className={controlClass}>
            <option value="all">All frameworks</option>
            {frameworks.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by data source" value={source} onChange={(event) => setSource(event.target.value)} className={controlClass}>
            <option value="all">All data sources</option>
            {sources.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="h-10 rounded-md px-3 text-sm font-medium text-[#2563EB] hover:bg-[#EFF6FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="p-10 text-center text-sm text-[#64748B]">
          {indicators.length === 0 ? "No indicators have been added for this sector yet." : "No indicators match your filters."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748B]">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Indicator</th>
                <th scope="col" className="px-5 py-3 font-medium">Unit</th>
                <th scope="col" className="px-5 py-3 font-medium">Data source</th>
                <th scope="col" className="px-5 py-3 font-medium">Framework</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((indicator) => (
                <tr key={indicator.id} className="align-top hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4">
                    <p className="font-medium">{indicator.name}</p>
                    <p className="mt-1 max-w-xl text-[#64748B]">{indicator.description ?? "No description available."}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#1D4ED8]">{indicator.unit ?? "-"}</span>
                  </td>
                  <td className="px-5 py-4 text-[#0F172A]">{indicator.data_source}</td>
                  <td className="px-5 py-4 text-[#0F172A]">{indicator.framework}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
