import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-white lg:flex">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />

        <Brand size="md" variant="light" />

        <div className="relative space-y-6">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Lost something on campus?
            <br />
            <span className="text-gold">We'll help you find it.</span>
          </h2>
          <p className="max-w-md text-white/80">
            ReturnMate connects students who lose belongings with those who find
            them — securely, instantly, across every block of IARE.
          </p>
        </div>

        <p className="relative text-xs text-white/60">
          © Institute of Aeronautical Engineering · An autonomous initiative
        </p>
      </aside>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-gradient-surface px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Brand size="lg" />
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-elegant">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-bold">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in with your IARE roll number to continue."
                  : "Register to report or claim items across campus."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition-smooth ${
                    mode === m
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <form className="space-y-4">
              <Field label="Name" placeholder="Aarav Reddy" />
              <Field label="Roll Number" placeholder="22951A0512" />
              <Field
                label="Phone Number"
                placeholder="+91 98765 43210"
                type="tel"
              />

              <Button asChild className="h-11 w-full text-sm font-semibold shadow-glow">
                <Link to="/dashboard">
                  {mode === "login" ? "Sign in" : "Create account"}
                </Link>
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to IARE's campus IT &amp; data policies.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">
        {label}
      </label>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
