import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PackageSearch,
  PackageCheck,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  LogOut,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";
import { Brand } from "./Brand";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/lost-items", label: "Lost Items", icon: ListChecks },
  { to: "/smart-match", label: "Smart Match", icon: Sparkles },
  { to: "/report-lost", label: "Report Lost", icon: PackageSearch },
  { to: "/report-found", label: "Report Found", icon: PackageCheck },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin", label: "Admin Panel", icon: ShieldCheck },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border px-5 py-5">
          <Brand size="md" variant="light" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-smooth hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur md:px-8">
          <div className="md:hidden">
            <Brand size="sm" />
          </div>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search items, locations, students…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-foreground/70 transition-smooth hover:text-primary">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
            <div className="flex items-center gap-3 rounded-lg border bg-background px-2 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-sm font-semibold text-primary-foreground">
                AR
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight">Aarav Reddy</p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  22951A0512
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
