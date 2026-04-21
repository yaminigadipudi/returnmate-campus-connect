import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  PackageSearch,
  PackageCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

interface ClaimedItem {
  id: string;
  itemName: string;
  claimedBy: string;
  rollNumber: string;
  mobile: string;
  status: "Pending Verification" | "Returned" | "Claimed";
}

// Real activity — populated only when users actually claim items.
// Starts empty; entries appear here as claims are made through the system.
const claimedItems: ClaimedItem[] = [];

const statusStyles: Record<ClaimedItem["status"], string> = {
  Claimed: "bg-primary/15 text-primary",
  "Pending Verification": "bg-warning/15 text-warning-foreground",
  Returned: "bg-success/15 text-success",
};

function Dashboard() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-hero p-6 text-white md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Welcome back, Aarav
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">
              Lost something? Found something?
              <br />
              Let's reunite it with its owner.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/75">
              Browse recent campus posts or file a new report in under a minute.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Link to="/report-lost">
                <PackageSearch /> Report Lost
              </Link>
            </Button>
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
              <Link to="/report-found">
                <PackageCheck /> Report Found
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Claimed lost items */}
      <PageHeader
        title="Claimed Lost Items"
        subtitle="Real activity — track which lost items have been claimed by students."
        action={
          <Button variant="outline" asChild>
            <Link to="/lost-items">View all lost items</Link>
          </Button>
        }
      />

      {claimedItems.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-semibold">No claims yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            When students claim lost items through the system, their details
            will appear here. Head over to{" "}
            <Link to="/lost-items" className="font-semibold text-primary hover:underline">
              Lost Items
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-soft md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Item Name</th>
                  <th className="px-5 py-3">Claimed By</th>
                  <th className="px-5 py-3">Roll Number</th>
                  <th className="px-5 py-3">Mobile</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {claimedItems.map((c) => (
                  <tr key={c.id} className="border-t transition-smooth hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{c.itemName}</td>
                    <td className="px-5 py-3">{c.claimedBy}</td>
                    <td className="px-5 py-3 font-mono text-xs">{c.rollNumber}</td>
                    <td className="px-5 py-3 font-mono text-xs">{c.mobile}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[c.status]}`}
                      >
                        {c.status === "Pending Verification" ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {claimedItems.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-4 shadow-soft">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="font-display font-semibold">{c.itemName}</p>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[c.status]}`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Claimed by:</span> {c.claimedBy}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Roll:</span>{" "}
                    <span className="font-mono">{c.rollNumber}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Mobile:</span>{" "}
                    <span className="font-mono">{c.mobile}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
}
