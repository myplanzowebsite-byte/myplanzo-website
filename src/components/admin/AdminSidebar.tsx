"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
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
  { href: "/admin/bookings", label: "Bookings", icon: <CalendarDays className="size-5" /> },
  { href: "/admin/disputes", label: "Disputes", icon: <ShieldAlert className="size-5" /> },
  { href: "/admin/reports", label: "Reports", icon: <BarChart3 className="size-5" /> },
  { href: "/admin/support", label: "Support Inbox", icon: <LifeBuoy className="size-5" /> },
  {
    href: "/admin/users",
    label: "Manage Users",
    icon: <Users className="size-5" />,
    children: [
      { href: "/admin/users/customers", label: "Customers" },
      { href: "/admin/users/professionals", label: "Professionals" },
    ],
  },
  { href: "/admin/services", label: "Manage Services", icon: <FileText className="size-5" /> },
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
  { href: "/admin/subadmins", label: "Manage Sub Admin", icon: <UserPlus className="size-5" /> },
];

export function AdminSidebar() {
  const pathname = usePathname();
  // Desktop: full vs icon-only rail. Mobile: drawer open/closed.
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Persist desktop collapsed state across reloads.
  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("adminSidebarCollapsed") : null;
    if (v === "1") setCollapsed(true);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarCollapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  return (
    <>
      {/* Mobile top bar with hamburger — only visible below lg */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-mp-border bg-mp-sidebar/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-mp-charcoal hover:bg-mp-card/70"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-base font-semibold text-mp-charcoal">MyPlanzo Admin</span>
      </div>

      {/* Mobile drawer + backdrop */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-mp-sidebar shadow-xl">
            <SidebarBody pathname={pathname} collapsed={false} onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Desktop sidebar — icon rail when collapsed */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 flex-col border-r border-mp-border/80 bg-mp-sidebar/90 backdrop-blur-sm lg:sticky lg:top-0 lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBody
          pathname={pathname}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
      </aside>
    </>
  );
}

function SidebarBody({
  pathname,
  collapsed,
  onToggleCollapsed,
  onCloseMobile,
}: {
  pathname: string;
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  onCloseMobile?: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-3 py-6">
      <div className={cn("mb-8 flex items-center gap-3 px-2", collapsed && "justify-center px-0")}>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-mp-border bg-mp-card text-sm font-semibold text-mp-accent"
          aria-hidden
        >
          M
        </div>
        {!collapsed ? <span className="flex-1 text-lg font-semibold text-mp-charcoal">MyPlanzo</span> : null}
        {onCloseMobile ? (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-mp-charcoal hover:bg-mp-card/70"
          >
            <X className="size-4" />
          </button>
        ) : null}
        {onToggleCollapsed ? (
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapsed}
            className={cn(
              "rounded-md p-1.5 text-mp-charcoal hover:bg-mp-card/70",
              collapsed && "mt-2",
            )}
          >
            {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto text-sm font-medium">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const hasChildren = !!item.children?.length;

          // Collapsed (icon-rail) mode: show icon-only direct links, even for
          // parents — clicking the parent takes the user to its index.
          if (collapsed) {
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "mx-auto flex size-10 items-center justify-center rounded-xl transition-colors",
                  active ? "bg-mp-nav-active text-mp-panel" : "text-mp-charcoal hover:bg-mp-card/60",
                )}
              >
                <span className={cn(active ? "text-mp-panel" : "text-mp-charcoal")}>{item.icon}</span>
              </Link>
            );
          }

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
          aria-label="Log out"
          title="Log out"
          className={cn(
            "w-full rounded-xl bg-mp-logout text-center font-semibold text-mp-panel transition-colors hover:bg-mp-accent-strong",
            collapsed ? "px-2 py-2 text-xs" : "py-3 text-sm",
          )}
        >
          {collapsed ? "⏻" : "Log Out"}
        </button>
      </form>
    </div>
  );
}
