import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type ItemStatus } from "./StatusBadge";

export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  image: string;
  images?: string[];
  status: ItemStatus;
  match?: number;
}

export function ItemCard({ item, action }: { item: Item; action?: React.ReactNode }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={item.status} />
        </div>
        {item.images && item.images.length > 1 && (
          <div className="absolute right-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
            +{item.images.length - 1} photos
          </div>
        )}
        {item.match !== undefined && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-card/95 p-2 backdrop-blur">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Match score</span>
              <span className="text-gold-foreground">{item.match}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-gold"
                style={{ width: `${item.match}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-base font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {item.time}
          </span>
        </div>

        {action ?? (
          <Button size="sm" className="mt-auto w-full">
            View details
          </Button>
        )}
      </div>
    </article>
  );
}
