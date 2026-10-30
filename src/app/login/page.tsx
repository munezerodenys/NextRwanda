"use client";

import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Public_Sans, Source_Serif_4 } from "next/font/google";

const sans = Public_Sans({ subsets: ["latin"], display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], display: "swap" });

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const DEMO_EMAIL = "auth-test@nexrwanda.com";
const DEMO_PASSWORD = "NexRwandaTest2026!";

/* ---------- Internationalisation (no extra packages) ---------- */
type Lang = "en" | "rw" | "fr";
const LANG_KEY = "nexrwanda_lang";

const languages: { code: Lang; short: string; name: string }[] = [
  { code: "en", short: "EN", name: "English" },
  { code: "rw", short: "RW", name: "Kinyarwanda" },
  { code: "fr", short: "FR", name: "Français" },
];

const en = {
  language: "Language",
  tagline: "National development intelligence",
  headline: "See the signals shaping Rwanda's next chapter.",
  description:
    "Trusted national indicators across education, health and employment, brought together in one workspace for analysts and decision-makers.",
  areas: {
    education: {
      name: "Education",
      detail: "Enrolment, completion and learning outcomes",
    },
    health: {
      name: "Health",
      detail: "Service coverage, facilities and public health trends",
    },
    employment: {
      name: "Employment",
      detail: "Labour force, jobs and skills indicators",
    },
  },
  title: "Sign in to your workspace",
  subtitle: "Use the email address registered with your account.",
  email: "Email address",
  emailPlaceholder: "name@organisation.gov.rw",
  password: "Password",
  passwordPlaceholder: "At least 8 characters",
  showPassword: "Show password",
  hidePassword: "Hide password",
  capsLock: "Caps Lock is on.",
  submit: "Sign in",
  submitting: "Signing in…",
  footer:
    "Access is limited to authorised users. Contact your administrator if you need an account.",
  errorFallback: "Unable to sign in. Check your details.",
  errorGeneric: "Unable to sign in.",
};
type Dict = typeof en;

const fr: Dict = {
  language: "Langue",
  tagline: "Intelligence du développement national",
  headline:
    "Découvrez les signaux qui façonnent le prochain chapitre du Rwanda.",
  description:
    "Des indicateurs nationaux fiables sur l'éducation, la santé et l'emploi, réunis dans un seul espace de travail pour les analystes et les décideurs.",
  areas: {
    education: {
      name: "Éducation",
      detail: "Inscriptions, achèvement et résultats d'apprentissage",
    },
    health: {
      name: "Santé",
      detail:
        "Couverture des services, établissements et tendances de santé publique",
    },
    employment: {
      name: "Emploi",
      detail: "Main-d'œuvre, emplois et indicateurs de compétences",
    },
  },
  title: "Connectez-vous à votre espace de travail",
  subtitle: "Utilisez l'adresse e-mail associée à votre compte.",
  email: "Adresse e-mail",
  emailPlaceholder: "nom@organisation.gov.rw",
  password: "Mot de passe",
  passwordPlaceholder: "Au moins 8 caractères",
  showPassword: "Afficher le mot de passe",
  hidePassword: "Masquer le mot de passe",
  capsLock: "Le verrouillage des majuscules est activé.",
  submit: "Se connecter",
  submitting: "Connexion en cours…",
  footer:
    "L'accès est réservé aux utilisateurs autorisés. Contactez votre administrateur si vous avez besoin d'un compte.",
  errorFallback: "Connexion impossible. Vérifiez vos informations.",
  errorGeneric: "Connexion impossible.",
};

const rw: Dict = {
  language: "Ururimi",
  tagline: "Ubushishozi ku iterambere ry'igihugu",
  headline: "Reba ibimenyetso bishushanya ejo hazaza h'u Rwanda.",
  description:
    "Ibipimo by'igihugu byizewe ku burezi, ubuzima n'umurimo, bihurijwe hamwe mu kazi kamwe ku bashakashatsi n'abafata ibyemezo.",
  areas: {
    education: {
      name: "Uburezi",
      detail: "Abiyandikishije, abarangiza n'ibyavuye mu myigire",
    },
    health: {
      name: "Ubuzima",
      detail:
        "Serivisi zitangwa, ibigo nderabuzima n'icyerekezo cy'ubuzima rusange",
    },
    employment: {
      name: "Umurimo",
      detail: "Abakozi, imirimo n'ibipimo by'ubumenyi ngiro",
    },
  },
  title: "Injira mu kazi kawe",
  subtitle: "Koresha imeri wiyandikishijeho.",
  email: "Imeri",
  emailPlaceholder: "izina@ikigo.gov.rw",
  password: "Ijambobanga",
  passwordPlaceholder: "Nibura inyuguti 8",
  showPassword: "Erekana ijambobanga",
  hidePassword: "Hisha ijambobanga",
  capsLock: "Caps Lock irafunguye.",
  submit: "Injira",
  submitting: "Urimo kwinjira…",
  footer:
    "Kwinjira ni ku bakoresha babyemerewe gusa. Vugana n'ubuyobozi niba ukeneye konti.",
  errorFallback: "Ntibyakunze kwinjira. Reba amakuru watanze.",
  errorGeneric: "Ntibyakunze kwinjira.",
};

const translations: Record<Lang, Dict> = { en, rw, fr };

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "rw" || value === "fr";
}

const focusAreas = [
  {
    key: "education",
    icon: EducationIcon,
    trend: "M2 26 C14 24, 22 22, 32 18 S52 12, 62 9 S72 6, 78 5",
  },
  {
    key: "health",
    icon: HealthIcon,
    trend: "M2 14 C12 10, 20 20, 30 18 S46 6, 56 12 S70 8, 78 6",
  },
  {
    key: "employment",
    icon: EmploymentIcon,
    trend: "M2 22 C10 16, 16 24, 26 16 S42 18, 50 10 S66 14, 78 6",
  },
] as const;

/* Custom styles (kept in this file so the page is fully self-contained). */
const css = `
.nxr-panel {
  isolation: isolate;
  background-image: radial-gradient(circle at 1px 1px, rgba(143, 184, 232, 0.12) 1px, transparent 0);
  background-size: 28px 28px;
}

.nxr-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(60% 50% at 88% 0%, rgba(37, 99, 168, 0.6), transparent 70%);
  pointer-events: none;
}

.nxr-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

.nxr-ridge,
.nxr-spark {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.8s cubic-bezier(0.22, 0.8, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 90ms + 150ms);
}

.nxr-spark {
  animation-duration: 1.2s;
  animation-delay: calc(var(--i, 0) * 140ms + 700ms);
}

.nxr-marker {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
  animation: pulse 2.8s ease-out 1.9s infinite;
}

.nxr-row {
  transition: background-color 150ms ease;
}

.nxr-row:hover {
  background-color: rgba(200, 214, 165, 0.06);
}

.nxr-field:focus-within label {
  color: #2563A8;
}

.nxr-field label {
  transition: color 150ms ease;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.55;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nxr-ridge,
  .nxr-spark {
    animation: none;
    stroke-dashoffset: 0;
  }
  .nxr-marker {
    animation: none;
    opacity: 0.2;
  }
}
`;

const inputClass =
  "block h-12 w-full rounded-md border border-[#CFC9BD] bg-white pl-11 text-[15px] text-[#17211B] " +
  "placeholder:text-[#8A9389] outline-none transition-[border-color,box-shadow] duration-150 " +
  "hover:border-[#A9B3A5] focus:border-[#2563A8] focus:ring-4 focus:ring-[#2563A8]/15 " +
  "aria-[invalid=true]:border-[#B4513C]";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  // Restore the saved language, or fall back to the browser language.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      const browser = navigator.language.slice(0, 2).toLowerCase();
      setLang(isLang(saved) ? saved : isLang(browser) ? browser : "en");
    } catch {
      /* storage unavailable: stay on English */
    }
  }, []);

  function useDemoAccount() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
    setShowPassword(false);
  }
  // Keep <html lang> in sync for screen readers and browser translation.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function changeLang(next: Lang) {
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail ?? t.errorFallback);
      }

      const data = await response.json();
      localStorage.setItem("nexrwanda_access_token", data.access_token);
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : t.errorGeneric,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePasswordKey(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState("CapsLock"));
  }

  return (
    <main
      className={`${sans.className} grid min-h-dvh bg-[#F4F1E8] text-[#17211B] lg:grid-cols-[1.05fr_0.95fr]`}
    >
      <style>{css}</style>
      {/* Brand panel */}
      <section
        className={`nxr-panel relative flex flex-col overflow-hidden bg-[#183C35] px-6 pb-10 pt-8 text-[#F6F1E5] sm:px-10 lg:px-14 lg:py-14`}
      >
        <TerrainLines />

        <div className="relative flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-[#C8D6A5]/40 bg-[#C8D6A5]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="#C8D6A5"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 17c3-6 5-6 7-2s4 3 6-3c1-2 3-3 5-2" />
              <path d="M3 21h18" opacity=".5" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">
            NexRwanda
          </span>
        </div>

        <div className="relative mt-10 lg:mt-auto lg:max-w-xl">
          <p className="mb-4 text-sm text-[#C8D6A5]">{t.tagline}</p>
          <h1
            className={`${serif.className} text-[1.9rem] font-semibold leading-[1.15] sm:text-4xl lg:text-[2.9rem]`}
          >
            {t.headline}
          </h1>
          <p className="mt-5 hidden max-w-md text-base leading-7 text-[#D9E0D1] lg:block">
            {t.description}
          </p>

          <ul className="mt-10 hidden border-t border-[#C8D6A5]/25 lg:block">
            {focusAreas.map(({ key, icon: Icon, trend }, index) => (
              <li
                key={key}
                className={`nxr-row flex items-start gap-4 border-b border-[#C8D6A5]/25 px-1 py-4`}
              >
                <Icon />
                <div className="flex-1">
                  <p className="font-medium">{t.areas[key].name}</p>
                  <p className="mt-0.5 text-sm leading-6 text-[#BCC9B6]">
                    {t.areas[key].detail}
                  </p>
                </div>
                <svg
                  viewBox="0 0 80 32"
                  className="mt-1 hidden h-8 w-20 shrink-0 xl:block"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 30h76" stroke="#8FB8E8" strokeOpacity=".2" />
                  <path
                    className="nxr-spark"
                    style={{ "--i": index } as React.CSSProperties}
                    d={trend}
                    pathLength={1}
                    stroke="#8FB8E8"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form panel */}
      <section className="relative flex items-center justify-center bg-[#FBFAF6] px-6 pb-12 pt-20 sm:px-10 lg:py-12">
        <div
          role="group"
          aria-label={t.language}
          className="absolute right-5 top-5 flex rounded-md border border-[#D8D2C4] bg-white p-0.5 text-xs font-medium sm:right-8 sm:top-6"
        >
          {languages.map(({ code, short, name }) => (
            <button
              key={code}
              type="button"
              lang={code}
              title={name}
              aria-label={name}
              aria-pressed={lang === code}
              onClick={() => changeLang(code)}
              className={`rounded px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563A8] ${
                lang === code
                  ? "bg-[#1E4E8C] text-white"
                  : "text-[#5B675F] hover:bg-[#1E4E8C]/8 hover:text-[#1E4E8C]"
              }`}
            >
              {short}
            </button>
          ))}
        </div>

        <div className="w-full max-w-sm">
          <h2
            className={`${serif.className} text-[1.75rem] font-semibold leading-tight`}
          >
            {t.title}
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-[#5B675F]">
            {t.subtitle}
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
            noValidate={false}
          >
            <div className="nxr-field">
              <label htmlFor="email" className="block text-sm font-medium">
                {t.email}
              </label>
              <div className="relative mt-2">
                <MailIcon />
                <input
                  id="email"
                  name="email"
                  className={inputClass}
                  type="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>
            </div>

            <div className="nxr-field">
              <label htmlFor="password" className="block text-sm font-medium">
                {t.password}
              </label>
              <div className="relative mt-2">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  className={`${inputClass} pr-12`}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyUp={handlePasswordKey}
                  onKeyDown={handlePasswordKey}
                  onBlur={() => setCapsLock(false)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "login-error" : undefined}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#6B766D] transition-colors hover:bg-[#1E4E8C]/8 hover:text-[#1E4E8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563A8]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {capsLock && (
                <p className="mt-2 text-sm text-[#7A5A1E]">{t.capsLock}</p>
              )}
            </div>

            {/* Reserved collapsing region so errors never cause a jump */}
            <div
              className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                error ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                {error && (
                  <p
                    id="login-error"
                    role="alert"
                    className="flex items-start gap-3 rounded-md border border-[#E6B9AB] border-l-4 border-l-[#B4513C] bg-[#FFF3EF] px-4 py-3 text-sm leading-5 text-[#8A3524]"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-0.5 h-4 w-4 shrink-0"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 1.7a8.3 8.3 0 100 16.6 8.3 8.3 0 000-16.6zm-.9 4.4h1.8v5H9.1v-5zm0 6.6h1.8v1.8H9.1v-1.8z" />
                    </svg>
                    <span>{error}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#D78D4D] px-5 font-semibold text-[#17211B] shadow-[0_1px_0_rgba(23,33,27,0.12)] transition-colors duration-150 hover:bg-[#C97D3D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D78D4D]/40 active:bg-[#B96F33] disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity=".25"
                  />
                  <path
                    d="M21 12a9 9 0 00-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </form>

          {/* Hackathon Demo Access */}
          <div className="mt-7 rounded-lg border border-[#C8D6A5] bg-[#F3F6EC] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-[#183C35] text-[#C8D6A5]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M20 8v6m-3-3h6" />
                  </svg>
                </span>

                <div>
                  <h3 className="text-sm font-semibold text-[#183C35]">
                    Hackathon Demo Access
                  </h3>
                  <p className="text-xs text-[#5B675F]">
                    Explore the NexRwanda platform
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#DCE8C9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#183C35]">
                Demo
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-md border border-[#E0E5D8] bg-white px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8579]">
                  Demo email
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#17211B]">
                  {DEMO_EMAIL}
                </p>
              </div>

              <div className="rounded-md border border-[#E0E5D8] bg-white px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8579]">
                  Demo password
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#17211B]">
                  {DEMO_PASSWORD}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={useDemoAccount}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#183C35] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#24564B] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#183C35]/20"
            >
              Use Demo Account
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>

            <p className="mt-2 text-center text-[11px] leading-5 text-[#687568]">
              For hackathon judges and demonstration purposes.
            </p>
          </div>

          <p className="mt-6 border-t border-[#E3DED2] pt-5 text-sm leading-6 text-[#5B675F]">
            {t.footer}
          </p>
        </div>
      </section>
    </main>
  );
}

/* Decorative terrain: layered ridge lines, a nod to Rwanda's hills. */
function TerrainLines() {
  const ridges = [
    "M-20 40 C 90 -10, 170 70, 280 30 S 480 -20, 640 40",
    "M-20 70 C 80 110, 200 20, 310 70 S 500 110, 640 60",
  ];
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full w-full opacity-60 lg:h-[58%] lg:opacity-100"
      viewBox="0 0 620 420"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          className="nxr-ridge"
          style={{ "--i": i } as React.CSSProperties}
          pathLength={1}
          d={ridges[i % 2]}
          transform={`translate(0 ${i * 42 + 30})`}
          stroke="#8FB8E8"
          strokeWidth="1"
          opacity={0.07 + i * 0.03}
        />
      ))}
      <circle className="nxr-marker" cx="398" cy="196" r="9" fill="#D78D4D" />
      <circle cx="398" cy="196" r="3.5" fill="#D78D4D" />
    </svg>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function FocusIconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#C8D6A5]/30 text-[#C8D6A5]">
      <svg {...iconProps} className="h-[18px] w-[18px]">
        {children}
      </svg>
    </span>
  );
}
function EducationIcon() {
  return (
    <FocusIconWrap>
      <path d="M2 9l10-5 10 5-10 5L2 9z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
    </FocusIconWrap>
  );
}
function HealthIcon() {
  return (
    <FocusIconWrap>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </FocusIconWrap>
  );
}
function EmploymentIcon() {
  return (
    <FocusIconWrap>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </FocusIconWrap>
  );
}

const fieldIcon =
  "pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6B766D]";
function MailIcon() {
  return (
    <svg {...iconProps} className={fieldIcon}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg {...iconProps} className={fieldIcon}>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg {...iconProps} className="h-5 w-5">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg {...iconProps} className="h-5 w-5">
      <path d="M3 3l18 18M10.6 5.1A9.6 9.6 0 0112 5c6.4 0 10 7 10 7a17 17 0 01-3.2 4M6.2 6.7C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  );
}
