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
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

// Statistics start at zero and grow only with real student activity.
const tabs = [
  { id: "users", label: "Users", icon: Users, count: 0 },
  { id: "lost", label: "Lost Items", icon: PackageSearch, count: 0 },
  { id: "found", label: "Found Items", icon: PackageCheck, count: 0 },
  { id: "reports", label: "Reports", icon: Flag, count: 0 },
] as const;

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
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("lost");

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

      {/* Tab cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-smooth ${
                isActive
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-card shadow-soft hover:border-primary/40 hover:shadow-elegant"
              }`}
            >
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold">{t.count}</p>
              </div>
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${
                  isActive ? "bg-white/15" : "bg-accent text-primary"
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
              {rows.map((r) => (
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <p>Showing 5 of 342 records</p>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">Previous</Button>
            <Button size="sm" variant="outline">Next</Button>
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
