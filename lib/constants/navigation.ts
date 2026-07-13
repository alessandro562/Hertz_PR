import {
  Home,
  Users,
  UsersRound,
  UserPlus,
  UserCog,
  Calendar,
  CalendarCheck,
  BarChart3,
  Trophy,
  MessageSquareText,
  Settings,
  BookOpen,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/domain";
import { ROLE } from "./roles";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles allowed to see the item. Omit for "everyone". */
  roles?: Role[];
}

/** Mobile bottom navigation (max 5, per the mobile-first spec §7). */
export const BOTTOM_NAV: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Lead", href: "/leads", icon: Users },
  { label: "PR", href: "/collaborators", icon: UserPlus },
  { label: "Eventi", href: "/events", icon: Calendar },
  { label: "Altro", href: "/more", icon: MoreHorizontal },
];

/** Desktop sidebar (spec §7). Some entries are Manager-only. */
export const SIDEBAR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Oggi", href: "/oggi", icon: CalendarCheck },
  { label: "Lead CRM", href: "/leads", icon: Users },
  { label: "Capi PR", href: "/capi-pr", icon: UsersRound, roles: [ROLE.MANAGER] },
  { label: "Collaboratori", href: "/collaborators", icon: UserPlus },
  { label: "Eventi", href: "/events", icon: Calendar },
  { label: "Performance", href: "/performance", icon: BarChart3 },
  { label: "Classifiche", href: "/rankings", icon: Trophy },
  { label: "Template", href: "/templates", icon: MessageSquareText },
  { label: "Utenti", href: "/users", icon: UserCog, roles: [ROLE.MANAGER] },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Guida", href: "/guide", icon: BookOpen },
];

/** Extra links shown on the mobile "Altro" page. */
export const MORE_NAV: NavItem[] = [
  { label: "Oggi", href: "/oggi", icon: CalendarCheck },
  { label: "Capi PR", href: "/capi-pr", icon: UsersRound, roles: [ROLE.MANAGER] },
  { label: "Performance", href: "/performance", icon: BarChart3 },
  { label: "Classifiche", href: "/rankings", icon: Trophy },
  { label: "Template", href: "/templates", icon: MessageSquareText },
  { label: "Utenti", href: "/users", icon: UserCog, roles: [ROLE.MANAGER] },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Guida", href: "/guide", icon: BookOpen },
];

/** Filter a nav list by the current role. */
export function navForRole(items: NavItem[], role: Role): NavItem[] {
  return items.filter((item) => !item.roles || item.roles.includes(role));
}
