import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, MoreVertical, Search, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        from: "me",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

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

          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <MessageSquare className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">No conversations yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Chats will appear here once you connect with another student.
              </p>
            </div>
          </div>
        </aside>

        {/* Chat window */}
        <section className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b px-5 py-3">
            <div>
              <p className="text-sm font-semibold">New conversation</p>
              <p className="text-xs text-muted-foreground">
                Type a message below to start chatting.
              </p>
            </div>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-surface p-5">
            {messages.length === 0 ? (
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

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t bg-card p-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-muted-foreground hover:text-primary"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" size="icon" className="h-10 w-10 shadow-glow" disabled={!draft.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
