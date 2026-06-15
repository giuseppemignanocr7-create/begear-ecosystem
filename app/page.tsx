import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  LineChart,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { KpiCard } from "@/components/core/kpi-card";
import { moduleIconMap } from "@/components/core/module-icon";
import { ModuleHeader, Section } from "@/components/core/module-page";
import { p1FlowSteps, p1OperationalMetrics } from "@/lib/begear/foundation-data";
import { accentSoft, modules } from "@/lib/begear/modules";

const kpiIcons: LucideIcon[] = [GraduationCap, UsersRound, Handshake, BriefcaseBusiness];

const navModules = modules.filter((module) => module.key !== "dashboard");

export default function DashboardPage() {
  const headerStats = p1OperationalMetrics.map((metric) => ({
    label: metric.label,
    value: metric.value,
    hint: metric.trend,
  }));

  return (
    <div className="space-y-8">
      <ModuleHeader moduleKey="dashboard" stats={headerStats} />

      <Section
        title="Moduli"
        description="Ogni area operativa ha la sua pagina dedicata."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {navModules.map((module) => {
            const Icon = moduleIconMap[module.icon];
            return (
              <Link
                key={module.key}
                href={module.path}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-foreground/20"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl"
                    style={{
                      backgroundColor: accentSoft(module.accent),
                      color: module.accent,
                    }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{module.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {module.tagline}
                    </p>
                  </div>
                  <ArrowRight
                    className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section
        title="KPI operativi"
        description="Indicatori sintetici della filiera BeGear."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {p1OperationalMetrics.map((metric, index) => (
            <KpiCard
              key={metric.label}
              title={metric.label}
              value={metric.value}
              detail={metric.detail}
              trend={metric.trend}
              points={metric.points}
              icon={kpiIcons[index] ?? LineChart}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Filiera"
        description="Dal primo contatto all'inserimento, in passi chiari."
      >
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {p1FlowSteps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="text-sm leading-6">{step}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
