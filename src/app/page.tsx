
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  GraduationCap,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const sectors = [
  {
    name: "Education",
    description:
      "Explore education indicators, enrollment trends, and development priorities.",
    icon: GraduationCap,
    href: "/education",
  },
  {
    name: "Health",
    description:
      "Explore health indicators and understand progress across health priorities.",
    icon: HeartPulse,
    href: "/health",
  },
  {
    name: "Employment",
    description:
      "Explore employment indicators and workforce development priorities.",
    icon: BriefcaseBusiness,
    href: "/employment",
  },
];

const features = [
  {
    title: "Development Intelligence",
    description:
      "Bring development indicators together to support evidence-based analysis.",
    icon: Sparkles,
  },
  {
    title: "Indicator Analytics",
    description:
      "Explore trends, compare measurements, and review indicator performance.",
    icon: BarChart3,
  },
  {
    title: "Geographic Insights",
    description:
      "Explore Rwanda's development priorities through geographic views.",
    icon: MapPinned,
  },
  {
    title: "Evidence and Transparency",
    description:
      "Review data sources, reporting periods, definitions, and verification status.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-white">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-blue-950">
                NexRwanda
              </p>
              <p className="text-xs text-slate-500">
                National Development Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#about" className="hover:text-blue-700">
              About
            </a>
            <a href="#sectors" className="hover:text-blue-700">
              Sectors
            </a>
            <a href="#features" className="hover:text-blue-700">
              Features
            </a>
          </nav>

          <Link
            href="/login"
            className="rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Sign in <ArrowRight className="ml-2 inline" size={16} />
          </Link>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Rwanda Development Intelligence Platform
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Data. Innovation.
              <span className="block text-emerald-400">
                Rwanda&apos;s Future.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100/80">
              Transform development data into meaningful insights. Explore
              national priorities, understand indicator performance, and
              support evidence-based decision-making.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-lg bg-emerald-500 px-6 py-4 font-semibold text-white transition hover:bg-emerald-400"
              >
                Access Platform
                <ArrowRight className="ml-2 inline" size={18} />
              </Link>

              <a
                href="#about"
                className="rounded-lg border border-white/30 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Platform
              </a>
            </div>

            <p className="mt-8 text-sm text-blue-200/70">
              Aligned with Rwanda&apos;s National Strategy for Transformation
              (NST2).
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <p className="text-sm text-blue-200">Platform overview</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Development Intelligence
                </h2>
              </div>
              <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                <TrendingUp size={25} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                ["Education", "Sector insights"],
                ["Health", "Sector insights"],
                ["Employment", "Sector insights"],
                ["NST2", "Framework"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/10 bg-white/10 p-5"
                >
                  <p className="text-lg font-bold text-white">{title}</p>
                  <p className="mt-2 text-sm text-blue-200">{subtitle}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-300" size={22} />
                <p className="font-semibold text-white">
                  Evidence-focused insights
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-blue-100/75">
                Review source information, reporting years, indicator
                definitions, and verification status.
              </p>
            </div>
            <p className="mt-4 text-xs text-blue-200/60">
              Platform overview — not a live national statistics report.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            About NexRwanda
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
            Turning development data into actionable intelligence
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            NexRwanda is designed to help users explore development indicators,
            understand progress, identify information gaps, and make better
            use of available evidence.
          </p>
        </div>
      </section>

      <section id="sectors" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Development sectors
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950">
              Explore Rwanda&apos;s key priorities
            </h2>
            <p className="mt-3 text-slate-600">
              Explore the platform&apos;s three development sectors.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sectors.map((sector) => {
              const Icon = sector.icon;

              return (
                <Link
                  key={sector.name}
                  href={sector.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950">
                    {sector.name}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {sector.description}
                  </p>
                  <span className="mt-6 inline-flex items-center font-semibold text-blue-800">
                    Explore sector
                    <ArrowRight
                      className="ml-2 transition group-hover:translate-x-1"
                      size={17}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            Platform capabilities
          </p>
          <h2 className="mt-3 text-3xl font-bold text-blue-950">
            Built for informed decisions
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-blue-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-blue-950 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">
          Explore Rwanda&apos;s development intelligence
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100/75">
          Access the NexRwanda platform to explore indicators, analytics, and
          development insights.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center rounded-lg bg-emerald-500 px-7 py-4 font-semibold text-white transition hover:bg-emerald-400"
        >
          Get Started <ArrowRight className="ml-2" size={18} />
        </Link>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-bold text-blue-950">NexRwanda</p>
            <p className="mt-1 text-sm text-slate-500">
              Data. Innovation. Rwanda&apos;s Future.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            National Development Intelligence Platform
          </p>
        </div>
      </footer>
    </main>
  );
}
