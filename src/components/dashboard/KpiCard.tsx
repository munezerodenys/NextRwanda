type Props = {
  label: string;
  value: number | null | undefined;
  loading?: boolean;
  tone?: "default" | "verified" | "pending";
  hint?: string;
};

const TONE = {
  default: "bg-[#2563EB]",
  verified: "bg-[#16A34A]",
  pending: "bg-amber-500",
};

export default function KpiCard({ label, value, loading, tone = "default", hint }: Props) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${TONE[tone]}`} aria-hidden="true" />
        <p className="text-sm text-[#64748B]">{label}</p>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[#E2E8F0]" />
      ) : (
        <p className="mt-2 text-3xl font-semibold tabular-nums">{value == null ? "–" : value.toLocaleString()}</p>
      )}
      {hint && <p className="mt-1 text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}