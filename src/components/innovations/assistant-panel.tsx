"use client";

import { AlertTriangle, ArrowLeft, Bot, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const suggestions = ["Which education indicators have missing targets?", "What health indicators have pending verification?", "Which measurements are below configured targets?"];
type Evidence = { indicator: string; sector: string; year: number; value: number; unit: string | null; target: number | null; data_source: string; verification_status: string };
type AssistantResponse = { answer: string; mode: string; evidence: Evidence[]; limitations: string[] };

export default function AssistantPanel() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("nexrwanda_access_token")) router.replace("/login");
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    const token = localStorage.getItem("nexrwanda_access_token");
    if (!token) { router.replace("/login"); return; }
    setLoading(true); setError("");
    try {
      const result = await fetch(`${apiUrl}/api/v1/assistant/chat`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) });
      if (result.status === 401) { localStorage.removeItem("nexrwanda_access_token"); router.replace("/login"); return; }
      if (!result.ok) throw new Error("The assistant service is currently unavailable.");
      setResponse(await result.json());
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "The assistant service is currently unavailable."); } finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-[#f7f9fc] text-[#12233f]"><header className="border-b border-[#dfe5ee] bg-[#102542] text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10"><Link href="/dashboard" className="text-sm font-bold uppercase tracking-[0.2em]">NexRwanda</Link><Link href="/dashboard/innovations" className="text-sm text-[#d9e4f3]">All innovations</Link></div></header><div className="mx-auto max-w-5xl px-6 py-8 lg:px-10"><Link href="/dashboard/innovations" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563a6]"><ArrowLeft size={16} /> All innovations</Link><div className="mt-8 flex gap-4"><div className="bg-[#e6f0fb] p-3 text-[#2563a6]"><Bot size={28} /></div><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4c7cae]">Evidence-grounded assistant</p><h1 className="mt-2 text-4xl font-bold tracking-tight">AI Development Intelligence Assistant</h1><p className="mt-3 text-[#5d6b7d]">Ask about connected development records and inspect the evidence behind every response.</p></div></div><div className="mt-8 border border-[#dfe5ee] bg-white p-6"><div className="flex items-start gap-3 border-b border-[#e8edf3] pb-5"><Bot className="mt-1 text-[#2563a6]" size={20} /><div><p className="font-bold">Deterministic evidence mode</p><p className="mt-1 text-sm leading-6 text-[#5d6b7d]">No external AI provider is configured. The backend analyzes real database records and clearly reports limitations instead of inventing statistics.</p></div></div><div className="mt-5 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setMessage(suggestion)} className="border border-[#cbd6e3] px-3 py-2 text-left text-sm hover:bg-[#f1f5f9]">{suggestion}</button>)}</div><form className="mt-5 flex gap-2" onSubmit={submit}><label className="sr-only" htmlFor="assistant-message">Ask a development question</label><input id="assistant-message" value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-12 flex-1 border border-[#cbd6e3] px-4 outline-none focus:border-[#2563a6]" placeholder="Ask a development question..." /><button disabled={loading} className="inline-flex items-center gap-2 bg-[#2563a6] px-5 font-semibold text-white disabled:opacity-60">{loading ? "Checking..." : "Send"}<Send size={16} /></button></form>{error && <p className="mt-4 flex items-center gap-2 border border-[#efc5bf] bg-[#fff4f2] p-4 text-sm text-[#9b3d2c]"><AlertTriangle size={17} /> {error}</p>}</div>{response && <><section className="mt-6 border border-[#dfe5ee] bg-white p-6"><div className="flex justify-between gap-4"><h2 className="text-xl font-bold">Answer</h2><span className="rounded-full bg-[#e8f5ed] px-3 py-1 text-xs font-bold text-[#217346]">{response.mode}</span></div><p className="mt-4 leading-7 text-[#334155]">{response.answer}</p></section><section className="mt-6 border border-[#dfe5ee] bg-white p-6"><h2 className="text-xl font-bold">Supporting evidence ({response.evidence.length})</h2>{response.evidence.length ? <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#f1f5f9]"><tr><th className="p-3">Indicator</th><th className="p-3">Value / target</th><th className="p-3">Year</th><th className="p-3">Source</th><th className="p-3">Verification</th></tr></thead><tbody>{response.evidence.map((record, index) => <tr className="border-t border-[#e8edf3]" key={`${record.indicator}-${record.year}-${index}`}><td className="p-3">{record.indicator}</td><td className="p-3">{record.value} / {record.target ?? "-"} {record.unit}</td><td className="p-3">{record.year}</td><td className="p-3">{record.data_source}</td><td className="p-3">{record.verification_status}</td></tr>)}</tbody></table></div> : <p className="mt-3 text-sm text-[#64748b]">No matching records were found.</p>}</section><section className="mt-6 border border-[#dfe5ee] bg-[#f8fafc] p-6"><h2 className="font-bold">Limitations</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5d6b7d]">{response.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></section></>}</div></main>;
}
