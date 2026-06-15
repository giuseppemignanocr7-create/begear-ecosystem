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
  p1AcademyCourses,
  p1AcademyEditions,
  p1Offices,
} from "@/lib/begear/foundation-data";
import { formatDate } from "@/lib/begear/format";

const ACCENT = "#059669";

type Course = (typeof p1AcademyCourses)[number];
type Edition = (typeof p1AcademyEditions)[number];

const statusTone: Record<string, StatusTone> = {
  active: "green",
  planned: "blue",
};

const statusLabel: Record<string, string> = {
  active: "Attivo",
  planned: "Pianificato",
};

function courseTitle(courseId: string): string {
  return (
    p1AcademyCourses.find((course) => course.id === courseId)?.title ??
    "Percorso Academy"
  );
}

function officeCity(officeId: string): string {
  return p1Offices.find((office) => office.id === officeId)?.city ?? "Sede";
}

interface Session {
  date: string;
  edition: string;
  topic: string;
  trainer: string;
  office: string;
  hours: number;
}

const sessions: Session[] = [
  {
    date: "2026-06-15",
    edition: "SAP-S4-NA-Q1",
    topic: "FI - Asset Accounting",
    trainer: "G. Russo",
    office: "Napoli",
    hours: 4,
  },
  {
    date: "2026-06-16",
    edition: "FULLSTACK-LE-Q1",
    topic: "React state management & hooks",
    trainer: "R. Esposito",
    office: "Lecce",
    hours: 4,
  },
  {
    date: "2026-06-17",
    edition: "SAP-S4-NA-Q1",
    topic: "CO - Product Costing",
    trainer: "G. Russo",
    office: "Napoli",
    hours: 4,
  },
  {
    date: "2026-06-18",
    edition: "AI-CYB-MI-Q2",
    topic: "ISO 27001 - controlli e audit",
    trainer: "S. Marino",
    office: "Milano",
    hours: 3,
  },
];

export default function AcademyPage() {
  const totalEnrolled = p1AcademyEditions.reduce(
    (total, edition) => total + edition.enrolled_count,
    0,
  );
  const totalCapacity = p1AcademyEditions.reduce(
    (total, edition) => total + edition.capacity,
    0,
  );
  const totalHours = p1AcademyCourses.reduce(
    (total, course) => total + course.duration_hours,
    0,
  );
  const fillRate = totalCapacity
    ? Math.round((totalEnrolled / totalCapacity) * 100)
    : 0;

  const courseColumns: Column<Course>[] = [
    {
      key: "code",
      header: "Codice",
      render: (course) => (
        <span className="font-mono text-xs">{course.course_code}</span>
      ),
    },
    {
      key: "title",
      header: "Corso",
      render: (course) => (
        <div>
          <p className="font-medium">{course.title}</p>
          <p className="text-xs text-muted-foreground">{course.domain}</p>
        </div>
      ),
    },
    { key: "mode", header: "Modalità", render: (course) => course.delivery_mode },
    {
      key: "hours",
      header: "Ore",
      align: "right",
      render: (course) => `${course.duration_hours}`,
    },
    {
      key: "cert",
      header: "Certificazione",
      render: (course) => course.certification_label,
    },
    {
      key: "status",
      header: "Stato",
      render: (course) => (
        <StatusBadge tone={statusTone[course.status] ?? "gray"}>
          {statusLabel[course.status] ?? course.status}
        </StatusBadge>
      ),
    },
  ];

  const editionColumns: Column<Edition>[] = [
    {
      key: "title",
      header: "Edizione",
      render: (edition) => (
        <div>
          <p className="font-medium">{edition.title}</p>
          <p className="text-xs text-muted-foreground">
            {courseTitle(edition.course_id)} · {officeCity(edition.office_id)}
          </p>
        </div>
      ),
    },
    {
      key: "period",
      header: "Periodo",
      render: (edition) =>
        `${formatDate(edition.start_date)} - ${formatDate(edition.end_date)}`,
    },
    {
      key: "fill",
      header: "Riempimento",
      render: (edition) => {
        const rate = Math.round(
          (edition.enrolled_count / edition.capacity) * 100,
        );
        return (
          <div className="flex min-w-[160px] items-center gap-2">
            <ProgressBar value={rate} accent={ACCENT} />
            <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {edition.enrolled_count}/{edition.capacity}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Stato",
      render: (edition) => (
        <StatusBadge tone={statusTone[edition.status] ?? "gray"}>
          {statusLabel[edition.status] ?? edition.status}
        </StatusBadge>
      ),
    },
  ];

  const sessionColumns: Column<Session>[] = [
    { key: "date", header: "Data", render: (row) => formatDate(row.date) },
    {
      key: "edition",
      header: "Edizione",
      render: (row) => <span className="font-mono text-xs">{row.edition}</span>,
    },
    {
      key: "topic",
      header: "Modulo",
      render: (row) => <span className="font-medium">{row.topic}</span>,
    },
    { key: "trainer", header: "Docente", render: (row) => row.trainer },
    { key: "office", header: "Sede", render: (row) => row.office },
    {
      key: "hours",
      header: "Ore",
      align: "right",
      render: (row) => `${row.hours}`,
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="academy"
        stats={[
          { label: "Corsi", value: String(p1AcademyCourses.length) },
          { label: "Edizioni", value: String(p1AcademyEditions.length) },
          {
            label: "Iscritti",
            value: String(totalEnrolled),
            hint: `${fillRate}% su ${totalCapacity} posti`,
          },
          { label: "Ore totali", value: String(totalHours) },
        ]}
      />

      <Section
        id="corsi"
        title="Corsi"
        description="Percorsi formativi attivi e pianificati con certificazioni associate."
      >
        <MetricGrid>
          <MetricTile
            label="Corsi a catalogo"
            value={String(p1AcademyCourses.length)}
            accent={ACCENT}
          />
          <MetricTile
            label="Ore di formazione"
            value={String(totalHours)}
            accent="#2563eb"
          />
          <MetricTile
            label="Iscritti totali"
            value={String(totalEnrolled)}
            hint={`su ${totalCapacity} posti`}
            accent="#7c3aed"
          />
          <MetricTile
            label="Tasso riempimento"
            value={`${fillRate}%`}
            accent="#d97706"
          />
        </MetricGrid>
        <DataTable
          caption="Corsi Academy"
          columns={courseColumns}
          rows={p1AcademyCourses}
          getRowKey={(course) => course.course_code}
        />
      </Section>

      <Section
        id="edizioni"
        title="Edizioni"
        description="Capienza, iscritti e periodo di erogazione per ogni edizione."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Edizioni Academy"
          columns={editionColumns}
          rows={p1AcademyEditions}
          getRowKey={(edition) => edition.edition_code}
        />
      </Section>

      <Section
        id="calendario"
        title="Calendario aule"
        description="Sessioni d'aula programmate con docenti, sedi e monte ore."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Calendario sessioni"
          columns={sessionColumns}
          rows={sessions}
          getRowKey={(row, index) => `${row.edition}-${index}`}
        />
      </Section>
    </div>
  );
}
