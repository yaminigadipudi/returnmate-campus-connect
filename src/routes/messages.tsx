import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, type FormEvent } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  MessageSquare,
  ShieldCheck,
  Clock,
  Lock,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

type AccessStatus = "none" | "pending" | "approved";

interface Contact {
  id: string;
  name: string;
  roll: string;
  initials: string;
}

interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

// Roster of students the user can request to chat with.
// In production this would come from the backend directory.
const directory: Contact[] = [
  { id: "u1", name: "Sneha Patil", roll: "22951A0498", initials: "SP" },
  { id: "u2", name: "Priya Sharma", roll: "22951A0455", initials: "PS" },
  { id: "u3", name: "Rahul Kumar", roll: "22951A0521", initials: "RK" },
  { id: "u4", name: "Arjun Mehra", roll: "22951A0612", initials: "AM" },
];

function MessagesPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [access, setAccess] = useState<Record<string, AccessStatus>>({});
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => directory.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );
  const status: AccessStatus = selectedId ? access[selectedId] ?? "none" : "none";
  const messages = selectedId ? threads[selectedId] ?? [] : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const filtered = directory.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.roll.toLowerCase().includes(query.toLowerCase()),
  );

  const requestAccess = () => {
    if (!selectedId) return;
    setAccess((prev) => ({ ...prev, [selectedId]: "pending" }));
  };

  // Demo helper — in production this is performed from the Admin Panel.
  const simulateApproval = () => {
    if (!selectedId) return;
    setAccess((prev) => ({ ...prev, [selectedId]: "approved" }));
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedId || status !== "approved") return;
    const text = draft.trim();
    if (!text) return;
    const msg: Message = {
      id: `${Date.now()}`,
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setThreads((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), msg],
    }));
    setDraft("");
  };

  return (
    <AppLayout>
      <div className="grid h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border bg-card shadow-soft md:grid-cols-[320px_1fr]">
        {/* Contacts list */}
        <aside
          className={`flex-col border-r ${selected ? "hidden md:flex" : "flex"}`}
        >
          <div className="border-b p-4">
            <h2 className="font-display text-lg font-semibold">Select a contact</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Choose who you want to message.
            </p>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll…"
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-xs text-muted-foreground">
                No contacts match your search.
              </p>
            ) : (
              filtered.map((c) => {
                const st = access[c.id] ?? "none";
                const isActive = selectedId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-smooth ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                      {c.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {c.name}
                      </span>
                      <span className="block truncate font-mono text-[11px] text-muted-foreground">
                        {c.roll}
                      </span>
                    </span>
                    <AccessPill status={st} />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right pane */}
        <section
          className={`min-w-0 flex-col ${selected ? "flex" : "hidden md:flex"}`}
        >
          {!selected ? (
            <EmptyChooseState />
          ) : (
            <>
              <header className="flex items-center justify-between border-b px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground md:hidden"
                    aria-label="Back to contacts"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {selected.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{selected.name}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {selected.roll}
                    </p>
                  </div>
                </div>
                <AccessPill status={status} />
              </header>

              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto bg-gradient-surface p-5"
              >
                {status !== "approved" ? (
                  <AccessGate
                    status={status}
                    onRequest={requestAccess}
                    onSimulate={simulateApproval}
                    contactName={selected.name}
                  />
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-xs rounded-2xl border bg-card/80 p-6 text-center shadow-sm backdrop-blur">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold">No messages yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Send your first message to begin the conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          m.from === "me"
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-card text-foreground"
                        }`}
                      >
                        <p>{m.text}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            m.from === "me"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t bg-card p-3"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    status === "approved"
                      ? "Type a message…"
                      : "Chat is locked until admin approves access"
                  }
                  disabled={status !== "approved"}
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 shadow-glow"
                  disabled={status !== "approved" || !draft.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function AccessPill({ status }: { status: AccessStatus }) {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
        <ShieldCheck className="h-3 w-3" /> Approved
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
      <Lock className="h-3 w-3" /> Locked
    </span>
  );
}

function EmptyChooseState() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-surface p-8">
      <div className="max-w-sm rounded-2xl border bg-card/80 p-8 text-center shadow-sm backdrop-blur">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserPlus className="h-6 w-6" />
        </div>
        <h3 className="font-display text-base font-semibold">Choose a contact</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a student from the list to request chat access and begin a
          conversation.
        </p>
      </div>
    </div>
  );
}

function AccessGate({
  status,
  onRequest,
  onSimulate,
  contactName,
}: {
  status: AccessStatus;
  onRequest: () => void;
  onSimulate: () => void;
  contactName: string;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md rounded-2xl border bg-card/90 p-6 text-center shadow-sm backdrop-blur">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          {status === "pending" ? (
            <Clock className="h-6 w-6" />
          ) : (
            <Lock className="h-6 w-6" />
          )}
        </div>
        <h3 className="font-display text-base font-semibold">
          {status === "pending"
            ? "Waiting for admin approval"
            : "Chat access required"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "pending"
            ? `Your request to message ${contactName} has been sent. You can start chatting once an admin approves it.`
            : `For student safety, messaging ${contactName} requires admin approval before the chat is enabled.`}
        </p>

        {status === "none" ? (
          <Button onClick={onRequest} className="mt-4 shadow-glow">
            Request Chat Access
          </Button>
        ) : (
          <Button disabled variant="outline" className="mt-4">
            <Clock className="h-3.5 w-3.5" /> Request pending
          </Button>
        )}

        <button
          onClick={onSimulate}
          className="mt-3 block w-full text-[11px] text-muted-foreground underline-offset-2 hover:underline"
        >
          (Demo) Simulate admin approval
        </button>
      </div>
    </div>
  );
}
