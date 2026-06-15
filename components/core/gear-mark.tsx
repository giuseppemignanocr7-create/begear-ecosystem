import { Cog } from "lucide-react";

import { cn } from "@/lib/utils";

export interface GearMarkProps {
  className?: string;
  isAnimated?: boolean;
}

export function GearMark({ className, isAnimated = false }: GearMarkProps) {
  return (
    <div
      className={cn(
        "relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground",
        className,
      )}
    >
      <Cog
        className={cn("size-5", isAnimated && "animate-gear-spin")}
        aria-hidden="true"
      />
      <span className="sr-only">BeGear Ecosystem</span>
    </div>
  );
}
