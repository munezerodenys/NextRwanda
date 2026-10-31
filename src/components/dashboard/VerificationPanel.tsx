type Props = { total: number; verified: number };

export default function VerificationPanel({ total, verified }: Props) {
  const pending = Math.max(total - verified, 0);
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm" aria-labelledby="verification-title">
      <h2 id="verification-title" className="text-base font-semibold">Data verification</h2>
      <p className="mt-1 text-sm text-[#64748B]">Share of recorded measurements that have been verified.</p>

      {total === 0 ? (
        <p className="mt-6 text-sm text-[#64748B]">No measurements have been recorded yet.</p>
      ) : (
        <>
          <div
            className="mt-5 flex h-3 overflow-hidden rounded-full bg-[#E2E8F0]"
            role="img"
            aria-label={`${verifiedPct}% of measurements verified`}
          >
            <div className="bg-[#16A34A]" style={{ width: `${verifiedPct}%` }} />
            <div className="bg-amber-400" style={{ width: `${100 - verifiedPct}%` }} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#16A34A]" />Verified</dt>
              <dd className="font-medium tabular-nums">{verified.toLocaleString()} ({verifiedPct}%)</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" />Pending verification</dt>
              <dd className="font-medium tabular-nums">{pending.toLocaleString()} ({100 - verifiedPct}%)</dd>
            </div>
            <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2">
              <dt className="text-[#64748B]">Total measurements</dt>
              <dd className="font-medium tabular-nums">{total.toLocaleString()}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}