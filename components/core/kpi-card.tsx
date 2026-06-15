import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SparkPoint {
  label: string;
  value: number;
}

export interface KpiCardProps {
  title: string;
  value: string;
  detail: string;
  trend: string;
  points: SparkPoint[];
  icon: LucideIcon;
  className?: string;
}

export function KpiCard({
  title,
  value,
  detail,
  trend,
  points,
  icon: Icon,
  className,
}: KpiCardProps) {
  const maxPoint = Math.max(...points.map((point) => point.value));

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </div>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="min-h-10 text-sm leading-5 text-muted-foreground">{detail}</p>
        <div className="flex h-12 items-end gap-1.5" aria-label={trend}>
          {points.map((point) => {
            const height =
              maxPoint === 0 ? 8 : Math.max(8, Math.round((point.value / maxPoint) * 48));
            return (
              <div
                key={point.label}
                className="w-full rounded-md bg-primary/70"
                style={{ height }}
                title={`${point.label}: ${point.value}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-success">
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
          <span>{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
