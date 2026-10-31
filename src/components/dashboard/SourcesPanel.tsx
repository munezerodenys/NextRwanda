type Props = { title: string; items: string[] | undefined; empty: string };

export default function SourcesPanel({ title, items, empty }: Props) {
  return (
    <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      {!items ? (
        <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-[#E2E8F0]" />
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-[#64748B]">{empty}</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-sm">{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}