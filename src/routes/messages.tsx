import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Send,
  Paperclip,
  MoreVertical,
  Search,
  ShieldAlert,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

interface Conversation {
  id: string;
  name: string;
  roll: string;
  item: string;
  preview: string;
  time: string;
  unread?: number;
  status: "approved" | "pending";
  initials: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Sneha Patil",
    roll: "22951A0498",
    item: "Casio Calculator",
    preview: "Yes, that's mine! When can we meet?",
    time: "2m",
    unread: 2,
    status: "approved",
    initials: "SP",
  },
  {
    id: "2",
    name: "Rahul Kumar",
    roll: "22951A0521",
    item: "Blue Water Bottle",
    preview: "Pending admin approval…",
    time: "1h",
    status: "pending",
    initials: "RK",
  },
  {
    id: "3",
    name: "Priya Sharma",
    roll: "22951A0455",
    item: "AirPods Pro Case",
    preview: "I think I saw it near the auditorium.",
    time: "Yesterday",
    status: "approved",
    initials: "PS",
  },
  {
    id: "4",
    name: "Arjun Mehra",
    roll: "22951A0612",
    item: "ID Card",
    preview: "Could you describe the wallet?",
    time: "2d",
    status: "approved",
    initials: "AM",
  },
];

const messages = [
  { from: "them", text: "Hi! I think I found your calculator.", time: "10:24 AM" },
  { from: "me", text: "Really? Where did you find it?", time: "10:25 AM" },
  { from: "them", text: "Mechanical lab, second bench from the door.", time: "10:25 AM" },
  { from: "them", text: "It has the name 'Sneha' written on the back.", time: "10:26 AM" },
  { from: "me", text: "Yes, that's mine! When can we meet?", time: "10:28 AM" },
];

function MessagesPage() {
  const [active, setActive] = useState(conversations[0]);

  return (
    <AppLayout>
      <div className="grid h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border bg-card shadow-soft md:grid-cols-[320px_1fr]">
        {/* Conversations list */}
        <aside className="flex flex-col border-r">
          <div className="border-b p-4">
            <h2 className="font-display text-lg font-semibold">Messages</h2>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search chats…"
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const isActive = active.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-smooth ${
                    isActive ? "bg-accent" : "hover:bg-muted/60"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {c.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {c.time}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      Re: {c.item}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-foreground/80">
                      {c.preview}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <StatusBadge status={c.status} />
                      {c.unread && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat window */}
        <section className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                {active.initials}
              </div>
              <div>
                <p className="text-sm font-semibold">{active.name}</p>
                <p className="text-xs text-muted-foreground">
                  {active.roll} · Re: {active.item}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={active.status} />
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:text-destructive">
                <ShieldAlert className="h-4 w-4" />
              </button>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </header>

          {active.status === "pending" ? (
            <div className="flex flex-1 items-center justify-center bg-gradient-surface p-8">
              <div className="max-w-sm rounded-2xl border bg-card p-8 text-center shadow-elegant">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  Chat awaiting admin approval
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  To protect both parties, an IARE admin will verify this match
                  before chat is enabled. You'll be notified shortly.
                </p>
                <Button className="mt-5 w-full">Request Chat Access</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-surface p-5">
                {messages.map((m, i) => (
                  <div
                    key={i}
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
                ))}
              </div>

              <footer className="flex items-center gap-2 border-t bg-card p-3">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-muted-foreground hover:text-primary">
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  placeholder="Type a message…"
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button size="icon" className="h-10 w-10 shadow-glow">
                  <Send className="h-4 w-4" />
                </Button>
              </footer>
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
