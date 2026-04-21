import { useState, type ChangeEvent } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Upload, MapPin, Calendar, FileText, X } from "lucide-react";

interface ReportFormProps {
  kind: "lost" | "found";
  title: string;
  subtitle: string;
}

const locations = [
  "Central Library",
  "Main Auditorium",
  "Canteen / Food Court",
  "CS Block",
  "Mechanical Block",
  "Aero Block",
  "Boys Hostel",
  "Girls Hostel",
  "Parking Area",
  "Sports Ground",
  "Other",
];

export function ReportForm({ kind, title, subtitle }: ReportFormProps) {
  const isLost = kind === "lost";
  const [images, setImages] = useState<string[]>([]);

  const MAX_IMAGES = 3;

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const slots = MAX_IMAGES - images.length;
    const next = files.slice(0, slots).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Item Name" placeholder="e.g. Black Leather Wallet" required full />

            <div className="md:col-span-2">
              <Label icon={FileText}>Description</Label>
              <textarea
                rows={4}
                placeholder="Add identifying details — color, brand, contents, scratches…"
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <Label icon={MapPin}>Location</Label>
              <select className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">Select a location…</option>
                {locations.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <Label icon={Calendar}>Date &amp; Time</Label>
              <input
                type="datetime-local"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {!isLost && (
              <div className="md:col-span-2">
                <Label>Condition of item</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["Good", "Minor damage", "Damaged"].map((c) => (
                    <label
                      key={c}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2.5 text-sm font-medium transition-smooth hover:border-primary hover:bg-accent"
                    >
                      <input type="radio" name="condition" className="accent-primary" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <Label icon={Upload}>
                Upload Images <span className="ml-1 font-normal text-muted-foreground">({images.length}/{MAX_IMAGES})</span>
              </Label>

              {images.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {images.map((src, idx) => (
                    <div
                      key={src}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <img src={src} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-smooth hover:bg-destructive group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {images.length < MAX_IMAGES && (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-8 text-center transition-smooth hover:border-primary hover:bg-accent">
                  <Upload className="h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Up to {MAX_IMAGES} photos · PNG, JPG · 5MB each
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <Button variant="outline" type="button">
              Save as draft
            </Button>
            <Button type="submit" className="shadow-glow">
              {isLost ? "Submit lost report" : "Submit found report"}
            </Button>
          </div>
        </form>

        {/* Sidebar tips */}
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold">
              Tips for {isLost ? "lost" : "found"} reports
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              {(isLost
                ? [
                    "Add as many identifying details as possible.",
                    "Mention exact block, room or landmark.",
                    "Include a similar reference image if you have one.",
                  ]
                : [
                    "Avoid posting identifying info that only the owner would know.",
                    "Hand over valuables to the security office when possible.",
                    "Cover sensitive details (cards, IDs) in your image.",
                  ]
              ).map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
            <h3 className="font-display text-base font-semibold">Need help?</h3>
            <p className="mt-1.5 text-sm text-primary-foreground/85">
              Contact the IARE Lost &amp; Found desk in the main administrative block, 9 AM – 5 PM.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Label({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
      {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
      {children}
    </label>
  );
}

function Field({
  label,
  full,
  ...props
}: {
  label: string;
  full?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={full ? "md:col-span-2" : undefined}>
      <Label>{label}</Label>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
