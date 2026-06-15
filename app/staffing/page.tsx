import {
  DataTable,
  MetricGrid,
  MetricTile,
  ModuleHeader,
  ProgressBar,
  Section,
  StatusBadge,
  type Column,
  type StatusTone,
} from "@/components/core/module-page";
import {
  p1Allocations,
  p1Consultants,
  p1Projects,
  p1Timesheets,
} from "@/lib/begear/foundation-data";
import { formatCurrency, formatDate } from "@/lib/begear/format";

const ACCENT = "#ea580c";

type Consultant = (typeof p1Consultants)[number];
type Allocation = (typeof p1Allocations)[number];
type Timesheet = (typeof p1Timesheets)[number];

const availabilityLabels: Record<string, string> = {
  allocated: "Allocato",
  available: "Disponibile",
  unavailable: "Non disponibile",
};

const availabilityTone: Record<string, StatusTone> = {
  allocated: "blue",
  available: "green",
  unavailable: "red",
};

const allocationLabels: Record<string, string> = {
  active: "Attiva",
  proposed: "Proposta",
  closed: "Chiusa",
};

const allocationTone: Record<string, StatusTone> = {
  active: "green",
  proposed: "amber",
  closed: "gray",
};

const timesheetLabels: Record<string, string> = {
  approved: "Approvato",
  submitted: "Inviato",
  draft: "Bozza",
};

const timesheetTone: Record<string, StatusTone> = {
  approved: "green",
  submitted: "blue",
  draft: "gray",
};

function consultantName(consultantId: string): string {
  return (
    p1Consultants.find((consultant) => consultant.id === consultantId)
      ?.display_name ?? "Consulente"
  );
}

function projectName(projectId: string): string {
  return (
    p1Projects.find((project) => project.id === projectId)?.name ?? "Progetto"
  );
}

export default function StaffingPage() {
  const allocated = p1Consultants.filter(
    (consultant) => consultant.availability_status === "allocated",
  ).length;
  const available = p1Consultants.filter(
    (consultant) => consultant.availability_status === "available",
  ).length;
  const totalHours = p1Timesheets.reduce(
    (total, timesheet) => total + timesheet.hours,
    0,
  );
  const averageRate = p1Consultants.length
    ? Math.round(
        p1Consultants.reduce(
          (total, consultant) => total + consultant.daily_rate_cents,
          0,
        ) / p1Consultants.length,
      )
    : 0;

  const consultantColumns: Column<Consultant>[] = [
    {
      key: "name",
      header: "Consulente",
      render: (consultant) => (
        <div>
          <p className="font-medium">{consultant.display_name}</p>
          <p className="text-xs text-muted-foreground">
            {consultant.profile_code}
          </p>
        </div>
      ),
    },
    {
      key: "seniority",
      header: "Seniority",
      render: (consultant) => consultant.seniority,
    },
    {
      key: "skill",
      header: "Competenza principale",
      render: (consultant) => consultant.primary_skill,
    },
    {
      key: "rate",
      header: "Tariffa/gg",
      align: "right",
      render: (consultant) => (
        <span className="tabular-nums">
          {formatCurrency(consultant.daily_rate_cents)}
        </span>
      ),
    },
    {
      key: "availability",
      header: "Disponibilità",
      render: (consultant) => (
        <StatusBadge
          tone={availabilityTone[consultant.availability_status] ?? "gray"}
        >
          {availabilityLabels[consultant.availability_status] ??
            consultant.availability_status}
        </StatusBadge>
      ),
    },
  ];

  const allocationColumns: Column<Allocation>[] = [
    {
      key: "consultant",
      header: "Consulente",
      render: (allocation) => (
        <span className="font-medium">
          {consultantName(allocation.consultant_id)}
        </span>
      ),
    },
    {
      key: "project",
      header: "Progetto",
      render: (allocation) => projectName(allocation.project_id),
    },
    {
      key: "period",
      header: "Periodo",
      render: (allocation) =>
        `${formatDate(allocation.start_date)} - ${formatDate(allocation.end_date)}`,
    },
    {
      key: "percentage",
      header: "Allocazione",
      render: (allocation) => (
        <div className="flex min-w-[140px] items-center gap-2">
          <ProgressBar value={allocation.allocation_percentage} accent={ACCENT} />
          <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {allocation.allocation_percentage}%
          </span>
        </div>
      ),
    },
    {
      key: "billable",
      header: "Billable",
      render: (allocation) => (
        <StatusBadge tone={allocation.billable ? "green" : "gray"}>
          {allocation.billable ? "Billable" : "Non billable"}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: (allocation) => (
        <StatusBadge tone={allocationTone[allocation.status] ?? "gray"}>
          {allocationLabels[allocation.status] ?? allocation.status}
        </StatusBadge>
      ),
    },
  ];

  const timesheetColumns: Column<Timesheet>[] = [
    {
      key: "date",
      header: "Data",
      render: (timesheet) => formatDate(timesheet.work_date),
    },
    {
      key: "consultant",
      header: "Consulente",
      render: (timesheet) => (
        <span className="font-medium">
          {consultantName(timesheet.consultant_id)}
        </span>
      ),
    },
    {
      key: "project",
      header: "Progetto",
      render: (timesheet) => projectName(timesheet.project_id),
    },
    {
      key: "activity",
      header: "Attività",
      render: (timesheet) => (
        <span className="text-xs text-muted-foreground">
          {timesheet.activity}
        </span>
      ),
    },
    {
      key: "hours",
      header: "Ore",
      align: "right",
      render: (timesheet) => `${timesheet.hours}`,
    },
    {
      key: "status",
      header: "Stato",
      render: (timesheet) => (
        <StatusBadge tone={timesheetTone[timesheet.status] ?? "gray"}>
          {timesheetLabels[timesheet.status] ?? timesheet.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="staffing"
        stats={[
          { label: "Consulenti", value: String(p1Consultants.length) },
          { label: "Allocati", value: String(allocated) },
          { label: "Disponibili", value: String(available) },
          { label: "Ore", value: totalHours.toLocaleString("it-IT") },
        ]}
      />

      <Section
        id="consulenti"
        title="Consulenti"
        description="Competenze, seniority, disponibilità e tariffe del pool ICT."
      >
        <MetricGrid>
          <MetricTile
            label="Consulenti"
            value={String(p1Consultants.length)}
            accent={ACCENT}
          />
          <MetricTile label="Allocati" value={String(allocated)} accent="#2563eb" />
          <MetricTile
            label="Disponibili"
            value={String(available)}
            accent="#059669"
          />
          <MetricTile
            label="Tariffa media"
            value={`${formatCurrency(averageRate)}/gg`}
            accent="#7c3aed"
          />
        </MetricGrid>
        <DataTable
          caption="Consulenti"
          columns={consultantColumns}
          rows={p1Consultants}
          getRowKey={(consultant) => consultant.profile_code}
        />
      </Section>

      <Section
        id="allocazioni"
        title="Allocazioni"
        description="Assegnazioni sui progetti con percentuale, billability e stato."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Allocazioni"
          columns={allocationColumns}
          rows={p1Allocations}
          getRowKey={(allocation) => allocation.id}
        />
      </Section>

      <Section
        id="timesheet"
        title="Timesheet"
        description="Ore consuntivate per consulente, progetto e stato di approvazione."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Timesheet"
          columns={timesheetColumns}
          rows={p1Timesheets}
          getRowKey={(timesheet) => timesheet.id}
        />
      </Section>
    </div>
  );
}
