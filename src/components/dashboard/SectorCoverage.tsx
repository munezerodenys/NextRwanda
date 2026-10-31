import type { SectorData } from "./types";

type Props = { sectors: SectorData[] | undefined; latestYear: number | null | undefined };

export default function SectorCoverage({ sectors, latestYear }: Props) {
  const max = Math.max(1, ...(sectors ?? []).map((sector) => sector.indicators));

  return (
    <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm" aria-labelledby="coverage-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 id="coverage-title" className="text-base font-semibold">Indicators by sector</h2>
          <p className="mt-1 text-sm text-[#64748B]">What is currently being measured.</p>
        </div>
        <p className="text-sm text-[#64748B]">
          Latest reporting year: <span className="font-medium text-[#0F172A]">{latestYear ?? "–"}</span>
        </p>
      </div>

      {!sectors ? (
        <div className="mt-6 space-y-4" aria-busy="true">
          {[0, 1, 2].map((key) => <div key={key} className="h-10 animate-pulse rounded bg-[#E2E8F0]" />)}
        </div>
      ) : sectors.length === 0 ? (
        <p className="mt-6 text-sm text-[#64748B]">No sectors have been configured yet.</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {sectors.map((sector) => (
            <li key={sector.id ?? sector.name}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium">{sector.name}</p>
                <p className="text-sm tabular-nums text-[#64748B]">{sector.indicators} indicators</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${(sector.indicators / max) * 100}%` }} />
              </div>
              {sector.description && <p className="mt-2 text-sm leading-6 text-[#64748B]">{sector.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}