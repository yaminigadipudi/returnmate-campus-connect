import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Users,
  PackageSearch,
  PackageCheck,
  Flag,
  Check,
  X,
  Eye,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

// Statistics are admin-controlled. They start at zero and are updated
// only by an admin via the Edit action below — never auto-incremented.
type StatId = "users" | "lost" | "found" | "reports";
const initialTabs: { id: StatId; label: string; icon: typeof Users; count: number }[] = [
  { id: "users", label: "Users", icon: Users, count: 0 },
  { id: "lost", label: "Lost Items", icon: PackageSearch, count: 0 },
  { id: "found", label: "Found Items", icon: PackageCheck, count: 0 },
  { id: "reports", label: "Reports", icon: Flag, count: 0 },
];

type ModerationRow = {
  id: string;
  student: string;
  roll: string;
  item: string;
  type: "lost" | "found";
  location: string;
  date: string;
  state: "pending" | "approved" | "matched";
};

// Moderation queue is empty until real submissions arrive.
const rows: ModerationRow[] = [];

function AdminPanel() {
  const [tabs, setTabs] = useState(initialTabs);
  const [active, setActive] = useState<StatId>("lost");
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<StatId, string>>({
    users: "0",
    lost: "0",
    found: "0",
    reports: "0",
  });

  const startEdit = () => {
    setDrafts(
      tabs.reduce(
        (acc, t) => ({ ...acc, [t.id]: String(t.count) }),
        {} as Record<StatId, string>,
      ),
    );
    setEditing(true);
  };

  const saveEdit = () => {
    setTabs((prev) =>
      prev.map((t) => ({
        ...t,
        count: Math.max(0, parseInt(drafts[t.id] || "0", 10) || 0),
      })),
    );
    setEditing(false);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Admin Control Center"
        subtitle="Moderate posts, approve chats and manage IARE student activity."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
            <span className="h-2 w-2 rounded-full bg-success" />
            All systems operational
          </span>
        }
      />

      {/* Statistics — admin-managed */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Platform statistics</h3>
          <p className="text-xs text-muted-foreground">
            Manually maintained by admin. Not visible to students.
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveEdit}>
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={startEdit}>
            <Pencil className="h-3.5 w-3.5" /> Edit statistics
          </Button>
        )}
      </div>

      {/* Tab cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => !editing && setActive(t.id)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-smooth ${
                isActive && !editing
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-card shadow-soft hover:border-primary/40 hover:shadow-elegant"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isActive && !editing ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </p>
                {editing ? (
                  <input
                    type="number"
                    min={0}
                    value={drafts[t.id]}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [t.id]: e.target.value }))
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 font-display text-2xl font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="mt-1 font-display text-2xl font-bold">{t.count}</p>
                )}
              </div>
              <span
                className={`ml-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                  isActive && !editing ? "bg-white/15" : "bg-accent text-primary"
                }`}
              >
                <t.icon className="h-5 w-5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h3 className="font-display text-base font-semibold">
              Pending moderation queue
            </h3>
            <p className="text-xs text-muted-foreground">
              Review and act on the latest student submissions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
            <Button size="sm">Bulk approve</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Item</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No submissions yet. New student reports will appear here for moderation.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t transition-smooth hover:bg-muted/30">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {r.id}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold">{r.student}</p>
                      <p className="text-xs text-muted-foreground">{r.roll}</p>
                    </td>
                    <td className="px-5 py-3">{r.item}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.type} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{r.location}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.state} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn label="View"><Eye className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="Approve" tone="success">
                          <Check className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label="Reject" tone="warning">
                          <X className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label="Delete" tone="destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <p>Showing {rows.length} of {rows.length} records</p>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={rows.length === 0}>Previous</Button>
            <Button size="sm" variant="outline" disabled={rows.length === 0}>Next</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function IconBtn({
  children,
  label,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  tone?: "success" | "warning" | "destructive";
}) {
  const toneCls =
    tone === "success"
      ? "hover:bg-success/10 hover:text-success"
      : tone === "warning"
        ? "hover:bg-warning/10 hover:text-warning"
        : tone === "destructive"
          ? "hover:bg-destructive/10 hover:text-destructive"
          : "hover:bg-accent hover:text-primary";
  return (
    <button
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-smooth ${toneCls}`}
    >
      {children}
    </button>
  );
}
