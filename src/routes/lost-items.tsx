import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard, type Item } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/lost-items")({
  component: LostItemsPage,
});

interface LostItem extends Item {
  claimed: boolean;
}

const initialItems: LostItem[] = [
  {
    id: "1",
    title: "Black Leather Wallet",
    description: "Contains student ID and a few cards. Last seen near library entrance.",
    location: "Central Library",
    time: "2h ago",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    status: "lost",
    claimed: false,
  },
  {
    id: "2",
    title: "Casio Scientific Calculator",
    description: "fx-991ES Plus with name 'Sneha' written on the back.",
    location: "Mechanical Lab",
    time: "Yesterday",
    image: "https://images.unsplash.com/photo-1564473185935-58113cba1e80?w=600&q=80",
    status: "lost",
    claimed: false,
  },
  {
    id: "3",
    title: "ID Card — 22951A05XX",
    description: "Lost near the parking lot during evening hours.",
    location: "Parking Block B",
    time: "3 days ago",
    image: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?w=600&q=80",
    status: "lost",
    claimed: false,
  },
];

const filters = ["All", "Unclaimed", "Claimed"] as const;

function LostItemsPage() {
  const [items, setItems] = useState<LostItem[]>(initialItems);
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const filtered = items.filter((i) => {
    if (active === "All") return true;
    if (active === "Claimed") return i.claimed;
    return !i.claimed;
  });

  const handleClaim = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, claimed: true } : i)),
    );
  };

  return (
    <AppLayout>
      <PageHeader
        title="Lost Items"
        subtitle="Browse all reported lost items across IARE. Claim an item if it belongs to you."
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

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground shadow-soft">
          No items to show.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              action={
                item.claimed ? (
                  <Button
                    size="sm"
                    disabled
                    className="mt-auto w-full bg-success/15 text-success hover:bg-success/15"
                  >
                    <CheckCircle2 /> Claimed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleClaim(item.id)}
                    className="mt-auto w-full"
                  >
                    Claim this item
                  </Button>
                )
              }
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
