import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard } from "@/components/ItemCard";
import { sampleItems } from "@/data/items";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/matches")({
  component: MatchesPage,
});

const filters = ["All", "Lost", "Found", "Matched"] as const;

function MatchesPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const filtered = sampleItems.filter((i) => {
    if (active === "All") return true;
    return i.status === active.toLowerCase();
  });

  return (
    <AppLayout>
      <PageHeader
        title="My posts & matches"
        subtitle="Review your reports and AI-suggested matches across the campus."
        action={
          <div className="inline-flex rounded-lg border bg-card p-1 shadow-soft">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition-smooth ${
                  active === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            action={
              item.status === "matched" ? (
                <Button asChild size="sm" className="mt-auto w-full bg-gradient-gold text-gold-foreground hover:opacity-90">
                  <Link to="/messages">
                    <MessageCircle /> Contact Owner
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ))}
      </div>
    </AppLayout>
  );
}
