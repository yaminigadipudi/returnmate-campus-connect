import type { Item } from "@/components/ItemCard";

/**
 * Smart matching — token-overlap similarity across name, description and location.
 * Returns 0–100. Pure presentation logic, no backend required.
 */
function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  a.forEach((t) => b.has(t) && inter++);
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function matchScore(a: Item, b: Item): number {
  const nameSim = jaccard(tokens(a.title), tokens(b.title));
  const descSim = jaccard(tokens(a.description), tokens(b.description));
  const locSim =
    a.location.toLowerCase().trim() === b.location.toLowerCase().trim()
      ? 1
      : jaccard(tokens(a.location), tokens(b.location));

  // Weighted: name 50%, description 30%, location 20%
  const score = nameSim * 0.5 + descSim * 0.3 + locSim * 0.2;
  return Math.round(score * 100);
}

export function findPotentialMatches(
  item: Item,
  pool: Item[],
  minScore = 30,
): Array<Item & { match: number }> {
  // A lost item matches found items, and vice versa.
  const opposite: Item["status"] = item.status === "lost" ? "found" : "lost";
  return pool
    .filter((p) => p.id !== item.id && p.status === opposite)
    .map((p) => ({ ...p, match: matchScore(item, p) }))
    .filter((p) => p.match >= minScore)
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
}
