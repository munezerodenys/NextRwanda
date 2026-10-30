import Link from "next/link";

const innovations = [
  {
    number: "01",
    label: "Highest priority",
    title: "AI Development Intelligence Assistant",
    description: "Let users ask questions such as, 'Which education indicators are below their targets?' NexRwanda answers from actual database records, shows the evidence and data source, and explains the finding in simple English.",
    innovation: "Evidence-grounded AI, not a chatbot that invents statistics.",
  },
  {
    number: "02",
    title: "Rwanda Development Gap Map",
    description: "Show districts or provinces with stronger and weaker outcomes for selected indicators wherever geographic data is available. Let users compare locations and identify areas that may need attention.",
    innovation: "Turn national statistics into geographically useful insights.",
  },
  {
    number: "03",
    title: "NST2 Progress and Early-Warning System",
    description: "Track indicators against documented targets and timelines. Flag indicators that are off track, show historical trends, and estimate future progress only when sufficient time-series data exists.",
    innovation: "Identify possible problems early instead of reporting results after the fact.",
  },
  {
    number: "04",
    title: "Development Action Simulator",
    description: "Allow decision-makers to compare hypothetical scenarios, such as how different improvement rates could affect an education or employment target by 2029.",
    innovation: "Explore possible outcomes before choosing an intervention. Simulations are clearly labelled as estimates, not real-world predictions.",
  },
  {
    number: "05",
    title: "Trust and Data Quality Centre",
    description: "Show each indicator's source, reporting period, definition, unit, last update, and data limitations. Flag missing values and outdated records, and let users export reports.",
    innovation: "Make every insight traceable and trustworthy.",
  },
];

export default function InnovationsPage() {
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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d07f3d]">Product direction</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Five innovations for a more useful NexRwanda.</h1>
          <p className="mt-6 text-lg leading-8 text-[#667267]">A roadmap for moving from static reporting toward evidence-led decisions, earlier signals, and trustworthy action.</p>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {innovations.map((item) => (
            <Link href={`/dashboard/innovations/${item.number === "01" ? "ai-assistant" : item.number === "02" ? "development-map" : item.number === "03" ? "early-warning" : item.number === "04" ? "action-simulator" : "data-quality"}`} className="border border-[#d8d1c3] bg-[#fbfaf6] p-7 transition hover:-translate-y-0.5 hover:border-[#23695b] md:p-8" key={item.number}>
              <div className="flex items-start justify-between gap-6">
                <span className="text-4xl font-semibold text-[#d8d1c3]">{item.number}</span>
                {item.label && <span className="border border-[#d78d4d] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#a75f27]">{item.label}</span>}
              </div>
              <h2 className="mt-7 text-2xl font-semibold leading-tight">{item.title}</h2>
              <p className="mt-4 leading-7 text-[#667267]">{item.description}</p>
              <div className="mt-7 border-l-4 border-[#23695b] pl-4"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#758174]">The innovation</p><p className="mt-2 leading-6 text-[#23695b]">{item.innovation}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}