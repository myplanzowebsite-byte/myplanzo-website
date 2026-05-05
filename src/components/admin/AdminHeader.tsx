"use client";

import { Bell, Search } from "lucide-react";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
};

export function AdminHeader({ title, subtitle, breadcrumbs }: AdminHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {breadcrumbs?.length ? <p className="mb-1 text-xs text-mp-muted">{breadcrumbs.join(" > ")}</p> : null}
        <h1 className="text-2xl font-semibold text-mp-charcoal">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-mp-muted">{subtitle}</p> : null}
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        <div className="relative min-w-[200px] max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mp-muted" />
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded-full border border-mp-border bg-mp-card py-2 pl-10 pr-4 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <button
          type="button"
          className="rounded-lg bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
        >
          Export Data
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-mp-border bg-mp-card px-3 py-2 shadow-sm">
          <div className="text-right text-xs leading-tight">
            <div className="font-medium text-mp-charcoal">Admin</div>
            <div className="text-mp-muted">MyPlanzo</div>
          </div>
          <div className="size-9 rounded-full border border-mp-border bg-mp-accent-soft" />
          <button
            type="button"
            className="relative rounded-md bg-mp-panel p-1.5 text-mp-accent"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute right-1 top-1 size-2 rounded-full bg-mp-accent" />
          </button>
        </div>
      </div>
    </header>
  );
}
