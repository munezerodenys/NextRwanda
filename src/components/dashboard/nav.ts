import type { IconName } from "./icons";

export type NavItem = { label: string; href: string; icon: IconName; exact?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

/**
 * Every href below exists in src/app (checked against your folder listing).
 * Indicators, Analytics and Settings are left out because those pages do not exist yet.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "dashboard", exact: true }],
  },
  {
    label: "Sectors",
    items: [
      { label: "Education", href: "/education", icon: "education" },
      { label: "Health", href: "/health", icon: "health" },
      { label: "Employment", href: "/employment", icon: "employment" },
    ],
  },
  {
    label: "Innovations",
    items: [
      { label: "Overview", href: "/dashboard/innovations", icon: "innovations", exact: true },
      { label: "Development Intelligence", href: "/dashboard/innovations/ai-assistant", icon: "intelligence" },
      { label: "Development Map", href: "/dashboard/innovations/development-map", icon: "map" },
      { label: "Early Warning", href: "/dashboard/innovations/early-warning", icon: "analytics" },
      { label: "Action Simulator", href: "/dashboard/innovations/action-simulator", icon: "settings" },
      { label: "Data Quality", href: "/dashboard/innovations/data-quality", icon: "indicators" },
    ],
  },
];

// Kept so any other file that imports NAV_ITEMS still works.
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);