import { cn } from "@/lib/utils";

type Status = "lost" | "found" | "matched" | "pending" | "approved";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const styles: Record<Status, string> = {
  lost: "bg-destructive/10 text-destructive border-destructive/20",
  found: "bg-success/10 text-success border-success/20",
  matched: "bg-gold/20 text-gold-foreground border-gold/40 shadow-gold",
  pending: "bg-muted text-muted-foreground border-border",
  approved: "bg-primary/10 text-primary border-primary/20",
};

const labels: Record<Status, string> = {
  lost: "Lost",
  found: "Found",
  matched: "Matched",
  pending: "Pending",
  approved: "Approved",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
