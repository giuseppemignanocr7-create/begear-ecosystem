import {
  DataTable,
  MetricGrid,
  MetricTile,
  ModuleHeader,
  Section,
  type Column,
} from "@/components/core/module-page";
import { p1Roles, p1Timesheets } from "@/lib/begear/foundation-data";
import { formatDateTime } from "@/lib/begear/format";

const ACCENT = "#dc2626";

type Role = (typeof p1Roles)[number];

const timesheetStatusLabels: Record<string, string> = {
  approved: "Approvati",
  submitted: "Inviati",
  draft: "Bozza",
};

const timesheetAccent: Record<string, string> = {
  approved: "#059669",
  submitted: "#2563eb",
  draft: "#64748b",
};

interface RopaEntry {
  activity: string;
  basis: string;
  dataCategory: string;
  retention: string;
}

const ropa: RopaEntry[] = [
  {
    activity: "Gestione candidature ATS",
    basis: "Consenso",
    dataCategory: "Dati identificativi, CV",
    retention: "24 mesi",
  },
  {
    activity: "Erogazione Academy",
    basis: "Contratto",
    dataCategory: "Dati formativi, presenze",
    retention: "5 anni",
  },
  {
    activity: "Staffing e timesheet",
    basis: "Contratto",
    dataCategory: "Dati lavorativi e ore",
    retention: "10 anni",
  },
  {
    activity: "Marketing e lead",
    basis: "Consenso",
    dataCategory: "Contatti, preferenze",
    retention: "24 mesi",
  },
  {
    activity: "Audit e sicurezza",
    basis: "Obbligo legale",
    dataCategory: "Log accessi",
    retention: "12 mesi",
  },
];

interface AuditRow {
  at: string;
  event: string;
  entity: string;
  actor: string;
}

const auditRows: AuditRow[] = [
  {
    at: "2026-06-14T11:00:00.000Z",
    event: "seed.p1.loaded",
    entity: "tenants",
    actor: "Platform Admin",
  },
  {
    at: "2026-06-14T09:30:00.000Z",
    event: "rbac.role.updated",
    entity: "roles",
    actor: "Tenant Admin",
  },
  {
    at: "2026-06-13T16:10:00.000Z",
    event: "timesheet.approved",
    entity: "timesheets",
    actor: "Staffing Manager",
  },
  {
    at: "2026-06-13T10:05:00.000Z",
    event: "gdpr.consent.recorded",
    entity: "candidates",
    actor: "Recruiter",
  },
];

export default function CompliancePage() {
  const timesheetByStatus = p1Timesheets.reduce<Record<string, number>>(
    (acc, timesheet) => {
      acc[timesheet.status] = (acc[timesheet.status] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const roleColumns: Column<Role>[] = [
    {
      key: "name",
      header: "Ruolo",
      render: (role) => <span className="font-medium">{role.name}</span>,
    },
    {
      key: "code",
      header: "Codice",
      render: (role) => <span className="font-mono text-xs">{role.code}</span>,
    },
    {
      key: "description",
      header: "Descrizione",
      render: (role) => (
        <span className="text-sm text-muted-foreground">{role.description}</span>
      ),
    },
  ];

  const ropaColumns: Column<RopaEntry>[] = [
    {
      key: "activity",
      header: "Trattamento",
      render: (row) => <span className="font-medium">{row.activity}</span>,
    },
    { key: "basis", header: "Base giuridica", render: (row) => row.basis },
    {
      key: "data",
      header: "Categorie dati",
      render: (row) => row.dataCategory,
    },
    { key: "retention", header: "Retention", render: (row) => row.retention },
  ];

  const auditColumns: Column<AuditRow>[] = [
    { key: "at", header: "Timestamp", render: (row) => formatDateTime(row.at) },
    {
      key: "event",
      header: "Evento",
      render: (row) => <span className="font-mono text-xs">{row.event}</span>,
    },
    { key: "entity", header: "Entità", render: (row) => row.entity },
    { key: "actor", header: "Attore", render: (row) => row.actor },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="compliance"
        stats={[
          { label: "Ruoli RBAC", value: String(p1Roles.length) },
          { label: "Audit event", value: String(auditRows.length) },
          { label: "Timesheet", value: String(p1Timesheets.length) },
          { label: "RLS", value: "Attiva", hint: "tenant-aware" },
        ]}
      />

      <Section
        id="ruoli"
        title="Ruoli e permessi"
        description="Modello RBAC del tenant BeGear con descrizione delle responsabilità."
      >
        <DataTable
          caption="Ruoli e permessi"
          columns={roleColumns}
          rows={p1Roles}
          getRowKey={(role) => role.code}
        />
      </Section>

      <Section
        id="timesheet"
        title="Stato timesheet"
        description="Distribuzione delle approvazioni dei timesheet consulenti."
        collapsible
        defaultOpen={false}
      >
        <MetricGrid>
          {Object.entries(timesheetByStatus).map(([status, count]) => (
            <MetricTile
              key={status}
              label={timesheetStatusLabels[status] ?? status}
              value={String(count)}
              accent={timesheetAccent[status] ?? ACCENT}
            />
          ))}
        </MetricGrid>
      </Section>

      <Section
        id="ropa"
        title="Registro trattamenti GDPR"
        description="Registro delle attività di trattamento con base giuridica e retention."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Registro trattamenti"
          columns={ropaColumns}
          rows={ropa}
          getRowKey={(row) => row.activity}
        />
      </Section>

      <Section
        id="audit"
        title="Audit log"
        description="Eventi tracciati sul tenant con attore ed entità coinvolta."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Audit log"
          columns={auditColumns}
          rows={auditRows}
          getRowKey={(row, index) => `${row.event}-${index}`}
        />
      </Section>
    </div>
  );
}
