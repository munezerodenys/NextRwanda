"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        throw new Error(body?.detail ?? "Unable to sign in. Check your details.");
      }

      const data = await response.json();
      localStorage.setItem("nexrwanda_access_token", data.access_token);
      router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e8] px-6 py-10 text-[#17211b]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full max-w-5xl overflow-hidden border border-[#d8d1c3] bg-[#fbfaf6] shadow-[0_24px_70px_rgba(39,51,39,0.12)] md:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[#183c35] px-8 py-12 text-[#f6f1e5] md:px-12 md:py-16">
            <p className="mb-20 text-sm font-semibold uppercase tracking-[0.24em] text-[#c8d6a5]">NexRwanda</p>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#c8d6a5]">National development intelligence</p>
            <h1 className="max-w-md text-4xl font-semibold leading-tight md:text-5xl">See the signals shaping Rwanda&apos;s next chapter.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#d9e0d1]">A focused workspace for exploring trusted indicators across education, health, and employment.</p>
            <div className="mt-10 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#c8d6a5]"><span className="border border-[#78927d] px-3 py-2">Education</span><span className="border border-[#78927d] px-3 py-2">Health</span><span className="border border-[#78927d] px-3 py-2">Employment</span></div>
          </div>
          <div className="px-8 py-12 md:px-12 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#758174]">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold">Sign in to your workspace</h2>
            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium">
                Email address
                <input className="mt-2 block h-12 w-full border border-[#cfc9bd] bg-white px-4 outline-none transition focus:border-[#23695b] focus:ring-2 focus:ring-[#23695b]/20" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="block text-sm font-medium">
                Password
                <input className="mt-2 block h-12 w-full border border-[#cfc9bd] bg-white px-4 outline-none transition focus:border-[#23695b] focus:ring-2 focus:ring-[#23695b]/20" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
              </label>
              {error && <p className="border border-[#e6b9ab] bg-[#fff3ef] px-4 py-3 text-sm text-[#9b3d2c]">{error}</p>}
              <button className="h-12 w-full bg-[#d78d4d] px-5 font-semibold text-[#17211b] transition hover:bg-[#c97d3d] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Continue to dashboard"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}