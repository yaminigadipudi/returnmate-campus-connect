import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { matchScore } from "@/lib/matching";
import { sampleItems } from "@/data/items";
import type { Item } from "@/components/ItemCard";
import {
  Sparkles,
  MapPin,
  Clock,
  Eye,
  MessageSquare,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/smart-match")({
  component: SmartMatchPage,
});

interface MatchPair {
  id: string;
  lost: Item;
  found: Item;
  score: number;
}

const MIN_SCORE = 50;

function buildPairs(items: Item[]): MatchPair[] {
  const lost = items.filter((i) => i.status === "lost" || i.status === "matched");
  const found = items.filter((i) => i.status === "found" || i.status === "matched");
  const pairs: MatchPair[] = [];

  for (const l of lost) {
    for (const f of found) {
      if (l.id === f.id) continue;
      const score = matchScore(l, f);
      if (score >= MIN_SCORE) {
        pairs.push({ id: `${l.id}-${f.id}`, lost: l, found: f, score });
      }
    }
  }

  return pairs.sort((a, b) => b.score - a.score);
}

function SmartMatchPage() {
  // Demo pool — Smart Match operates on the shared item registry.
  // Once items are reported via "Report Lost" / "Report Found", they appear here.
  const [pool] = useState<Item[]>(sampleItems);
  const [threshold, setThreshold] = useState<number>(MIN_SCORE);

  const pairs = useMemo(
    () => buildPairs(pool).filter((p) => p.score >= threshold),
    [pool, threshold],
  );

  const highMatches = pairs.filter((p) => p.score >= 80).length;

  return (
    <AppLayout>
      <PageHeader
        title="Smart Match"
        subtitle="Automatically detected matches between Lost and Found items based on name, description, and location similarity."
      />

      {/* Summary + threshold */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total matches
          </p>
          <p className="mt-1 font-display text-3xl font-bold">{pairs.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-gold-foreground" />
            High confidence (&gt;80%)
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-gold-foreground">
            {highMatches}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-soft">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Min match score: <span className="text-foreground">{threshold}%</span>
          </label>
          <input
            type="range"
            min={30}
            max={95}
            step={5}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
        </div>
      </div>

      {/* Matches list */}
      {pairs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/50 p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 font-display text-lg font-semibold">
            No matches found yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Smart Match will surface pairs as soon as lost &amp; found reports overlap above
            the threshold.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pairs.map((pair) => (
            <MatchRow key={pair.id} pair={pair} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}

function MatchRow({ pair }: { pair: MatchPair }) {
  const isHigh = pair.score >= 80;

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-card shadow-soft transition-smooth hover:shadow-elegant ${
        isHigh ? "ring-2 ring-gold/40" : ""
      }`}
    >
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto_1fr_auto] md:items-center md:gap-6 md:p-5">
        <ItemSide label="Lost" item={pair.lost} />

        <div className="flex md:flex-col items-center justify-center gap-2 border-y md:border-y-0 md:border-x py-3 md:py-0 md:px-4">
          <div
            className={`font-display text-2xl font-bold ${
              isHigh ? "text-gold-foreground" : "text-primary"
            }`}
          >
            {pair.score}%
          </div>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full ${isHigh ? "bg-gradient-gold" : "bg-primary"}`}
              style={{ width: `${pair.score}%` }}
            />
          </div>
          <StatusBadge status={isHigh ? "matched" : "pending"} />
        </div>

        <ItemSide label="Found" item={pair.found} />

        <div className="flex flex-col gap-2 md:w-36">
          <Button size="sm" variant="outline" className="w-full">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </Button>
          <Button size="sm" className="w-full">
            <MessageSquare className="h-3.5 w-3.5" />
            Contact Owner
          </Button>
        </div>
      </div>
    </article>
  );
}

function ItemSide({ label, item }: { label: "Lost" | "Found"; item: Item }) {
  return (
    <div className="flex gap-3">
      <img
        src={item.image}
        alt={item.title}
        className="h-20 w-20 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label} item
        </p>
        <h3 className="truncate font-display font-semibold leading-tight">
          {item.title}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {item.description}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {item.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {item.time}
          </span>
        </div>
      </div>
    </div>
  );
}
