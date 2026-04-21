import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard, type Item } from "@/components/ItemCard";
import { StatusBadge, type ItemStatus } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { findPotentialMatches } from "@/lib/matching";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Flag,
  X,
  MapPin,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/lost-items")({
  component: LostItemsPage,
});

interface LostItem extends Item {
  claimedBy?: { name: string; roll: string; phone: string; proof: string };
}

// Real data only — items appear here once students report them via "Report Lost".
const initialItems: LostItem[] = [];

const filters = ["All", "Unclaimed", "Pending Verification", "Returned"] as const;

function LostItemsPage() {
  const [items, setItems] = useState<LostItem[]>(initialItems);
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [claimTarget, setClaimTarget] = useState<LostItem | null>(null);
  const [matchTarget, setMatchTarget] = useState<LostItem | null>(null);
  const [reportTarget, setReportTarget] = useState<LostItem | null>(null);

  const filtered = items.filter((i) => {
    if (active === "All") return true;
    if (active === "Unclaimed")
      return i.status !== "claimed" && i.status !== "pending-verification" && i.status !== "returned";
    if (active === "Pending Verification") return i.status === "pending-verification";
    if (active === "Returned") return i.status === "returned";
    return true;
  });

  const submitClaim = (claim: { name: string; roll: string; phone: string; proof: string }) => {
    if (!claimTarget) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === claimTarget.id
          ? { ...i, status: "pending-verification" as ItemStatus, claimedBy: claim }
          : i,
      ),
    );
    setClaimTarget(null);
  };

  const markReturned = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "returned" as ItemStatus } : i)),
    );
  };

  return (
    <AppLayout>
      <PageHeader
        title="Lost Items"
        subtitle="Browse all reported lost items across IARE. Claim with proof of ownership — admin or finder verifies before the item is marked Returned."
        action={
          <div className="inline-flex flex-wrap rounded-lg border bg-card p-1 shadow-soft">
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
          {filtered.map((item) => {
            const potential = findPotentialMatches(item, items);
            return (
              <ItemCard
                key={item.id}
                item={item}
                action={
                  <div className="mt-auto flex flex-col gap-2">
                    {potential.length > 0 && (
                      <button
                        onClick={() => setMatchTarget(item)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-foreground transition-smooth hover:bg-gold/20"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {potential.length} potential match{potential.length > 1 ? "es" : ""}
                      </button>
                    )}

                    {item.status === "returned" ? (
                      <Button size="sm" disabled className="w-full bg-success/15 text-success hover:bg-success/15">
                        <CheckCircle2 /> Returned to owner
                      </Button>
                    ) : item.status === "pending-verification" ? (
                      <div className="flex flex-col gap-2">
                        <div className="rounded-md border border-warning/30 bg-warning/10 p-2 text-xs">
                          <p className="font-semibold text-warning-foreground">
                            Awaiting verification
                          </p>
                          {item.claimedBy && (
                            <p className="mt-0.5 text-muted-foreground">
                              Claim by {item.claimedBy.name} ({item.claimedBy.roll})
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => markReturned(item.id)}
                          >
                            <ShieldCheck /> Verify & return
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReportTarget(item)}
                            title="Report fake claim"
                          >
                            <Flag />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setClaimTarget(item)}
                          className="flex-1"
                        >
                          Claim this item
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReportTarget(item)}
                          title="Report this listing"
                        >
                          <Flag />
                        </Button>
                      </div>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      {claimTarget && (
        <ClaimDialog
          item={claimTarget}
          onCancel={() => setClaimTarget(null)}
          onSubmit={submitClaim}
        />
      )}
      {matchTarget && (
        <MatchesDialog
          item={matchTarget}
          pool={items}
          onClose={() => setMatchTarget(null)}
        />
      )}
      {reportTarget && (
        <ReportDialog
          item={reportTarget}
          onClose={() => setReportTarget(null)}
        />
      )}
    </AppLayout>
  );
}

/* ---------- Claim dialog ---------- */
function ClaimDialog({
  item,
  onCancel,
  onSubmit,
}: {
  item: LostItem;
  onCancel: () => void;
  onSubmit: (c: { name: string; roll: string; phone: string; proof: string }) => void;
}) {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [phone, setPhone] = useState("");
  const [proof, setProof] = useState("");

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roll.trim() || !phone.trim() || proof.trim().length < 10) return;
    onSubmit({ name: name.trim(), roll: roll.trim(), phone: phone.trim(), proof: proof.trim() });
  };

  return (
    <Modal onClose={onCancel} title={`Claim "${item.title}"`}>
      <p className="mb-4 text-sm text-muted-foreground">
        Provide your details and proof of ownership. The status will be set to
        <span className="font-semibold text-foreground"> Pending Verification</span> until
        the finder or an admin confirms it belongs to you.
      </p>
      <form onSubmit={handle} className="space-y-3">
        <Input label="Your name" value={name} onChange={setName} placeholder="Aarav Reddy" />
        <Input label="Roll number" value={roll} onChange={setRoll} placeholder="22951A05XX" />
        <Input label="Mobile number" value={phone} onChange={setPhone} placeholder="+91 …" />
        <div>
          <label className="mb-1.5 block text-xs font-semibold">
            Proof of ownership <span className="text-destructive">*</span>
          </label>
          <textarea
            rows={4}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="Enter details to verify ownership — unique marks, contents, where/when lost, serial number…"
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Minimum 10 characters. False claims are reportable.
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="shadow-glow">
            <ShieldCheck /> Submit claim
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Potential matches dialog ---------- */
function MatchesDialog({
  item,
  pool,
  onClose,
}: {
  item: LostItem;
  pool: LostItem[];
  onClose: () => void;
}) {
  const matches = findPotentialMatches(item, pool);
  return (
    <Modal onClose={onClose} title={`Potential matches for "${item.title}"`}>
      <p className="mb-4 text-sm text-muted-foreground">
        Smart matching ranks results by item name, description and location similarity.
      </p>
      {matches.length === 0 ? (
        <div className="rounded-lg border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          No matches found yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {matches.map((m) => (
            <li key={m.id} className="flex gap-3 rounded-lg border bg-card p-3">
              <img src={m.image} alt={m.title} className="h-16 w-16 shrink-0 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold">{m.title}</p>
                  <StatusBadge status={m.status} />
                </div>
                <p className="line-clamp-1 text-xs text-muted-foreground">{m.description}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{m.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{m.time}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-gold" style={{ width: `${m.match}%` }} />
                  </div>
                  <span className="text-xs font-semibold">{m.match}%</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

/* ---------- Report dialog ---------- */
function ReportDialog({
  item,
  onClose,
}: {
  item: LostItem;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("Fake claim");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Modal onClose={onClose} title={`Report "${item.title}"`}>
      {sent ? (
        <div className="py-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="font-semibold">Report submitted</p>
          <p className="mt-1 text-sm text-muted-foreground">
            An admin will review this report and act on it.
          </p>
          <Button className="mt-4" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option>Fake claim</option>
              <option>Incorrect information</option>
              <option>Suspicious user</option>
              <option>Inappropriate content</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Details</label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what's wrong with this listing or claim…"
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="destructive">
              <Flag /> Send report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/* ---------- Tiny modal ---------- */
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-elegant"
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-display text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
