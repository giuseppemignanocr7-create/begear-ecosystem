import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { moduleIconMap } from "@/components/core/module-icon";
import { accentSoft, getModuleByKey, type ModuleKey } from "@/lib/begear/modules";
import { cn } from "@/lib/utils";

export interface ModuleStat {
  label: string;
  value: string;
  hint?: string;
}

export interface ModuleHeaderProps {
  moduleKey: ModuleKey;
  stats?: ModuleStat[];
  action?: ReactNode;
}

export function ModuleHeader({ moduleKey, stats, action }: ModuleHeaderProps) {
  const mod = getModuleByKey(moduleKey);
  const Icon = moduleIconMap[mod.icon];

  return (
    <header className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="grid size-12 shrink-0 place-items-center rounded-2xl text-white shadow-sm"
            style={{ backgroundColor: mod.accent }}
          >
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: mod.accent }}
            >
              {mod.tagline}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {mod.label}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {mod.description}
            </p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {stats && stats.length > 0 ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <dt className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1.5 text-2xl font-semibold tracking-tight">
                {stat.value}
              </dd>
              {stat.hint ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
              ) : null}
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  );
}

export interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Section({
  id,
  title,
  description,
  action,
  collapsible = false,
  defaultOpen = true,
  children,
}: SectionProps) {
  if (collapsible) {
    return (
      <details id={id} open={defaultOpen} className="group scroll-mt-24 space-y-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-foreground">
            <ChevronDown
              className="size-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>
        <div className="space-y-4 pt-1">{children}</div>
      </details>
    );
  }

  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export interface AccentPillProps {
  accent: string;
  children: ReactNode;
}

export function AccentPill({ accent, children }: AccentPillProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: accentSoft(accent), color: accent }}
    >
      {children}
    </span>
  );
}

export type StatusTone = "green" | "amber" | "red" | "blue" | "violet" | "gray";

const toneHex: Record<StatusTone, string> = {
  green: "#059669",
  amber: "#d97706",
  red: "#dc2626",
  blue: "#2563eb",
  violet: "#7c3aed",
  gray: "#64748b",
};

export interface SubNavItem {
  id: string;
  label: string;
}

export function SubNav({ items }: { items: SubNavItem[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-card p-1.5 shadow-card">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

export function StatusBadge({
  tone = "gray",
  children,
}: {
  tone?: StatusTone;
  children: ReactNode;
}) {
  const hex = toneHex[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${hex}14`, color: hex }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  accent = "#2563eb",
}: {
  value: number;
  accent?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
      role="presentation"
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: accent }}
      />
    </div>
  );
}

export interface MetricTileProps {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  delta?: string;
  deltaTone?: StatusTone;
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  );
}

export function MetricTile({
  label,
  value,
  hint,
  accent,
  delta,
  deltaTone = "green",
}: MetricTileProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-card">
      {accent ? (
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
      ) : null}
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {delta ? (
          <span
            className="mb-1 text-xs font-medium"
            style={{ color: toneHex[deltaTone] }}
          >
            {delta}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export interface MiniBarPoint {
  label: string;
  value: number;
}

export function MiniBars({
  points,
  accent = "#2563eb",
}: {
  points: MiniBarPoint[];
  accent?: string;
}) {
  const max = Math.max(...points.map((point) => point.value), 1);
  return (
    <div className="flex h-20 items-end gap-1.5" aria-hidden="true">
      {points.map((point) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${Math.max(4, (point.value / max) * 100)}%`,
                backgroundColor: accent,
              }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DefinitionList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 border-b border-border/60 pb-2"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-right text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
  headClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  caption?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    alignClass[column.align ?? "left"],
                    column.headClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 align-middle",
                      alignClass[column.align ?? "left"],
                      column.cellClassName,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
