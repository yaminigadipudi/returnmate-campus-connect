import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard } from "@/components/ItemCard";
import { sampleItems } from "@/data/items";
import { Button } from "@/components/ui/button";
import {
  PackageSearch,
  PackageCheck,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const stats = [
  { label: "Lost reports", value: "342", trend: "+12%", icon: PackageSearch, tone: "destructive" },
  { label: "Found items", value: "287", trend: "+18%", icon: PackageCheck, tone: "success" },
  { label: "Successful matches", value: "1,180", trend: "+24%", icon: Sparkles, tone: "gold" },
  { label: "Active this week", value: "94", trend: "+6%", icon: TrendingUp, tone: "primary" },
];

const toneClass: Record<string, string> = {
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  gold: "bg-gold/20 text-gold-foreground",
  primary: "bg-primary/10 text-primary",
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

      {/* Stats */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, trend, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-xl border bg-card p-5 shadow-soft transition-smooth hover:shadow-elegant"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${toneClass[tone]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success">
                {trend} <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      {/* Recent posts */}
      <PageHeader
        title="Recent campus posts"
        subtitle="Latest lost and found items reported across IARE."
        action={
          <Button variant="outline" asChild>
            <Link to="/matches">View all</Link>
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </AppLayout>
  );
}
