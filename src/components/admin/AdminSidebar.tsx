"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Cloud,
  UserPlus,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  ShieldAlert,
  BarChart3,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  children?: { href: string; label: string }[];
};

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: <CalendarDays className="size-5" />,
  },
  {
    href: "/admin/disputes",
    label: "Disputes",
    icon: <ShieldAlert className="size-5" />,
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: <BarChart3 className="size-5" />,
  },
  {
    href: "/admin/support",
    label: "Support Inbox",
    icon: <LifeBuoy className="size-5" />,
  },
  {
    href: "/admin/users",
    label: "Manage Users",
    icon: <Users className="size-5" />,
    children: [
      { href: "/admin/users/customers", label: "Customers" },
      { href: "/admin/users/professionals", label: "Professionals" },
    ],
  },
  {
    href: "/admin/services",
    label: "Manage Services",
    icon: <FileText className="size-5" />,
  },
  {
    href: "/admin/cms",
    label: "Manage CMS",
    icon: <Cloud className="size-5" />,
    children: [
      { href: "/admin/cms/announcements", label: "Announcements" },
      { href: "/admin/cms/banners", label: "Banners" },
      { href: "/admin/cms/faq", label: "FAQs" },
      { href: "/admin/cms/legal", label: "Legal Pages" },
      { href: "/admin/cms/push", label: "Push Notifications" },
      { href: "/admin/cms/events", label: "Event Types" },
      { href: "/admin/cms/vendor-categories", label: "Vendor Categories" },
    ],
  },
  {
    href: "/admin/subadmins",
    label: "Manage Sub Admin",
    icon: <UserPlus className="size-5" />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-mp-border/80 bg-mp-sidebar/90 px-3 py-6 backdrop-blur-sm">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div
          className="flex size-10 items-center justify-center rounded-full border border-mp-border bg-mp-card text-sm font-semibold text-mp-accent"
          aria-hidden
        >
          M
        </div>
        <span className="text-lg font-semibold text-mp-charcoal">MyPlanzo</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 text-sm font-medium">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const hasChildren = !!item.children?.length;

          return (
            <div key={item.href}>
              {hasChildren ? (
                <div
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                    active ? "bg-mp-nav-active text-mp-panel" : "text-mp-charcoal hover:bg-mp-card/60",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn(active ? "text-mp-panel" : "text-mp-charcoal")}>{item.icon}</span>
                    {item.label}
                  </span>
                  <ChevronDown className="size-4 opacity-80" />
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                      ? "bg-mp-nav-active text-mp-panel"
                      : "text-mp-charcoal hover:bg-mp-card/60",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        pathname === item.href ||
                          (item.href !== "/admin" && pathname.startsWith(item.href))
                          ? "text-mp-panel"
                          : "text-mp-charcoal",
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  {!hasChildren && <ChevronRight className="size-4 opacity-60" />}
                </Link>
              )}
              {hasChildren && (
                <ul className="ml-4 mt-1 space-y-0.5 border-l border-mp-border/70 pl-4">
                  {item.children!.map((ch) => {
                    const childActive = pathname === ch.href || pathname.startsWith(ch.href + "/");
                    return (
                      <li key={ch.href}>
                        <Link
                          href={ch.href}
                          className={cn(
                            "flex items-center gap-2 rounded-full px-3 py-2 text-mp-charcoal transition-colors",
                            childActive ? "bg-mp-card shadow-sm" : "hover:bg-mp-card/50",
                          )}
                        >
                          <span className={cn("size-1.5 rounded-full", childActive ? "bg-mp-accent" : "bg-mp-charcoal")} />
                          {ch.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
      <form action="/api/auth/logout" method="POST" className="mt-4">
        <button
          type="submit"
          className="w-full rounded-xl bg-mp-logout py-3 text-center text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent-strong"
        >
          Log Out
        </button>
      </form>
    </aside>
  );
}
