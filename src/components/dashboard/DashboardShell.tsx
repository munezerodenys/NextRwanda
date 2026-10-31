"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";
import { NAV_GROUPS } from "./nav";

type Props = {
  title: string;
  subtitle: string;
  onSignOut: () => void;
  children: ReactNode;
};

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2";

export default function DashboardShell({ title, subtitle, onSignOut, children }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMenuOpen(false);
      }
    }
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const showLabels = !collapsed;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#0F172A]/60 backdrop-blur-[1px] lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-[#101B35] text-slate-300 shadow-xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none lg:transition-[width] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-[18px]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-bold text-white ring-1 ring-white/20">
            N
          </span>
          <div className={`min-w-0 ${showLabels ? "" : "lg:hidden"}`}>
            <p className="truncate text-sm font-semibold tracking-tight text-white">NexRwanda</p>
            <p className="truncate text-xs text-slate-400">Development Intelligence</p>
          </div>
          <button
            className={`ml-auto rounded p-1 text-slate-400 hover:text-white lg:hidden ${FOCUS}`}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="nx-scroll flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex > 0 ? "mt-5" : ""}>
              <p className={`mb-1.5 px-3 text-xs font-medium text-slate-500 ${showLabels ? "" : "lg:hidden"}`}>{group.label}</p>
              {!showLabels && groupIndex > 0 && <div className="mx-3 mb-2 hidden h-px bg-white/10 lg:block" />}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href, item.exact);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        title={collapsed ? item.label : undefined}
                        className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                          active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-[#2563EB]" />}
                        <Icon name={item.icon} className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                        <span className={`truncate ${showLabels ? "" : "lg:hidden"}`}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`shrink-0 border-t border-white/10 px-5 py-4 text-xs text-slate-500 ${showLabels ? "" : "lg:hidden"}`}>
          Aligned with Rwanda&rsquo;s NST2
        </div>
      </aside>

      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-[72px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-[#E2E8F0] bg-white/95 px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur sm:gap-3 sm:px-6">
          <button
            className={`rounded-md p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] lg:hidden ${FOCUS}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" />
          </button>
          <button
            className={`hidden rounded-md p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] lg:block ${FOCUS}`}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
          >
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
            <p className="hidden truncate text-[13px] text-[#64748B] sm:block">{subtitle}</p>
          </div>

          <div className="relative ml-auto" ref={menuRef}>
            <button
              className={`flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white py-1 pl-1 pr-3 text-sm font-medium transition-colors hover:bg-[#F8FAFC] ${FOCUS}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#101B35] text-white">
                <Icon name="user" className="h-3.5 w-3.5" />
              </span>
              <span className="hidden sm:inline">Account</span>
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white py-1 shadow-lg ring-1 ring-black/5">
                <Link role="menuitem" href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] focus:outline-none">
                  <Icon name="settings" className="h-4 w-4 text-[#64748B]" /> Settings
                </Link>
                <div className="my-1 h-px bg-[#E2E8F0]" />
                <button role="menuitem" onClick={onSignOut} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] focus:outline-none">
                  <Icon name="logout" className="h-4 w-4 text-[#64748B]" /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}