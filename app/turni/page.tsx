import {
  DataTable,
  MetricGrid,
  MetricTile,
  ModuleHeader,
  Section,
  StatusBadge,
  type Column,
  type StatusTone,
} from "@/components/core/module-page";
import { p1Offices, p1ResourceShifts } from "@/lib/begear/foundation-data";
import { formatDateTime } from "@/lib/begear/format";

const ACCENT = "#0d9488";

type Shift = (typeof p1ResourceShifts)[number];

const statusLabels: Record<string, string> = {
  confirmed: "Confermato",
  assigned: "Assegnato",
  planned: "Pianificato",
};

const statusTone: Record<string, StatusTone> = {
  confirmed: "green",
  assigned: "blue",
  planned: "amber",
};

function officeCity(officeId: string): string {
  return p1Offices.find((office) => office.id === officeId)?.city ?? "Sede";
}

function shiftHours(shift: Shift): number {
  const diff =
    new Date(shift.ends_at).getTime() - new Date(shift.starts_at).getTime();
  return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
}

export default function TurniPage() {
  const confirmed = p1ResourceShifts.filter(
    (shift) => shift.status === "confirmed",
  ).length;
  const offices = new Set(p1ResourceShifts.map((shift) => shift.office_id)).size;
  const totalHours = p1ResourceShifts.reduce(
    (total, shift) => total + shiftHours(shift),
    0,
  );

  const shiftColumns: Column<Shift>[] = [
    {
      key: "activity",
      header: "Attività",
      render: (shift) => <span className="font-medium">{shift.activity}</span>,
    },
    {
      key: "office",
      header: "Sede",
      render: (shift) => officeCity(shift.office_id),
    },
    {
      key: "start",
      header: "Inizio",
      render: (shift) => formatDateTime(shift.starts_at),
    },
    {
      key: "end",
      header: "Fine",
      render: (shift) => formatDateTime(shift.ends_at),
    },
    {
      key: "hours",
      header: "Ore",
      align: "right",
      render: (shift) => `${shiftHours(shift)} h`,
    },
    {
      key: "status",
      header: "Stato",
      render: (shift) => (
        <StatusBadge tone={statusTone[shift.status] ?? "gray"}>
          {statusLabels[shift.status] ?? shift.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="turni"
        stats={[
          { label: "Turni", value: String(p1ResourceShifts.length) },
          { label: "Sedi", value: String(offices) },
          { label: "Confermati", value: String(confirmed) },
          { label: "Ore pianificate", value: `${totalHours} h` },
        ]}
      />

      <Section
        id="pianificazione"
        title="Pianificazione"
        description="Turni e attività operative programmate sulle sedi BeGear."
      >
        <DataTable
          caption="Pianificazione turni"
          columns={shiftColumns}
          rows={p1ResourceShifts}
          getRowKey={(shift) => shift.id}
        />
      </Section>

      <Section
        id="copertura"
        title="Copertura per sede"
        description="Distribuzione dei turni sulle sedi di Napoli, Milano e Lecce."
        collapsible
        defaultOpen={false}
      >
        <MetricGrid>
          {p1Offices.map((office) => {
            const count = p1ResourceShifts.filter(
              (shift) => shift.office_id === office.id,
            ).length;
            return (
              <MetricTile
                key={office.id}
                label={office.city}
                value={`${count}`}
                hint="turni pianificati"
                accent={ACCENT}
              />
            );
          })}
        </MetricGrid>
      </Section>
    </div>
  );
}
