import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataTable,
  ModuleHeader,
  ProgressBar,
  Section,
  StatusBadge,
  type Column,
  type StatusTone,
} from "@/components/core/module-page";
import { p1Candidates, p1JobOpenings } from "@/lib/begear/foundation-data";
import { formatDate } from "@/lib/begear/format";

const ACCENT = "#0284c7";

type Opening = (typeof p1JobOpenings)[number];
type Candidate = (typeof p1Candidates)[number];

const statusLabels: Record<string, string> = {
  active: "Aperta",
  screening: "Screening",
  interviewing: "Colloqui",
  placement_ready: "Pronto",
};

const statusTones: Record<string, StatusTone> = {
  active: "green",
  screening: "amber",
  interviewing: "blue",
  placement_ready: "green",
};

function statusLabel(status: string): string {
  return statusLabels[status] ?? status;
}

function priorityTone(score: number): StatusTone {
  if (score >= 90) return "red";
  if (score >= 80) return "amber";
  return "blue";
}

const funnel = [
  { label: "Candidature", value: 48 },
  { label: "Screening", value: 22 },
  { label: "Colloquio tecnico", value: 11 },
  { label: "Offerta", value: 4 },
  { label: "Assunti", value: 2 },
];

interface Interview {
  date: string;
  candidate: string;
  opening: string;
  type: string;
  interviewer: string;
  done: boolean;
}

const interviews: Interview[] = [
  {
    date: "2026-06-12",
    candidate: "Alumni SAP Finance Track",
    opening: "BG-SAP-001",
    type: "Tecnico SAP FI/CO",
    interviewer: "G. Russo",
    done: true,
  },
  {
    date: "2026-06-16",
    candidate: "Alumni Full Stack Track",
    opening: "BG-FE-003",
    type: "Tecnico React/Node",
    interviewer: "R. Esposito",
    done: false,
  },
  {
    date: "2026-06-17",
    candidate: "Alumni Cybersecurity Track",
    opening: "BG-AI-002",
    type: "HR screening",
    interviewer: "S. Marino",
    done: false,
  },
  {
    date: "2026-06-18",
    candidate: "Alumni SAP Finance Track",
    opening: "BG-SAP-001",
    type: "Colloquio cliente partner",
    interviewer: "Partner SAP",
    done: false,
  },
];

export default function AtsPage() {
  const averagePriority = Math.round(
    p1JobOpenings.reduce((total, opening) => total + opening.priority_score, 0) /
      p1JobOpenings.length,
  );
  const plannedInterviews = interviews.filter((row) => !row.done).length;
  const funnelMax = funnel[0]?.value ?? 1;

  const openingColumns: Column<Opening>[] = [
    {
      key: "code",
      header: "Codice",
      render: (opening) => (
        <span className="font-mono text-xs">{opening.opening_code}</span>
      ),
    },
    {
      key: "title",
      header: "Posizione",
      render: (opening) => (
        <div>
          <p className="font-medium">{opening.title}</p>
          <p className="text-xs text-muted-foreground">
            {opening.business_area} · {opening.location}
          </p>
        </div>
      ),
    },
    {
      key: "contract",
      header: "Contratto",
      render: (opening) => opening.contract_type,
    },
    {
      key: "skills",
      header: "Competenze",
      render: (opening) => (
        <span className="text-xs text-muted-foreground">
          {opening.required_skills.join(" · ")}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priorità",
      align: "right",
      render: (opening) => (
        <StatusBadge tone={priorityTone(opening.priority_score)}>
          {opening.priority_score}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: (opening) => (
        <StatusBadge tone={statusTones[opening.status] ?? "gray"}>
          {statusLabel(opening.status)}
        </StatusBadge>
      ),
    },
  ];

  const candidateColumns: Column<Candidate>[] = [
    {
      key: "code",
      header: "Codice",
      render: (candidate) => (
        <span className="font-mono text-xs">{candidate.profile_code}</span>
      ),
    },
    {
      key: "name",
      header: "Candidato",
      render: (candidate) => (
        <div>
          <p className="font-medium">{candidate.display_name}</p>
          <p className="text-xs text-muted-foreground">{candidate.headline}</p>
        </div>
      ),
    },
    { key: "source", header: "Origine", render: (candidate) => candidate.source },
    {
      key: "skills",
      header: "Competenze",
      render: (candidate) => (
        <span className="text-xs text-muted-foreground">
          {candidate.skills.join(" · ")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: (candidate) => (
        <StatusBadge tone={statusTones[candidate.status] ?? "gray"}>
          {statusLabel(candidate.status)}
        </StatusBadge>
      ),
    },
  ];

  const interviewColumns: Column<Interview>[] = [
    { key: "date", header: "Data", render: (row) => formatDate(row.date) },
    {
      key: "candidate",
      header: "Candidato",
      render: (row) => <span className="font-medium">{row.candidate}</span>,
    },
    {
      key: "opening",
      header: "Posizione",
      render: (row) => <span className="font-mono text-xs">{row.opening}</span>,
    },
    { key: "type", header: "Tipo", render: (row) => row.type },
    { key: "interviewer", header: "Interviewer", render: (row) => row.interviewer },
    {
      key: "status",
      header: "Stato",
      render: (row) => (
        <StatusBadge tone={row.done ? "green" : "blue"}>
          {row.done ? "Svolto" : "Pianificato"}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="ats"
        stats={[
          { label: "Posizioni", value: String(p1JobOpenings.length) },
          { label: "Priorità media", value: String(averagePriority) },
          { label: "Candidati", value: String(p1Candidates.length) },
          { label: "Colloqui pianificati", value: String(plannedInterviews) },
        ]}
      />

      <Section
        id="posizioni"
        title="Posizioni aperte"
        description="Pipeline di selezione ordinata per priorità con competenze richieste."
      >
        <DataTable
          caption="Posizioni aperte"
          columns={openingColumns}
          rows={[...p1JobOpenings].sort(
            (a, b) => b.priority_score - a.priority_score,
          )}
          getRowKey={(opening) => opening.opening_code}
        />
      </Section>

      <Section
        id="pipeline"
        title="Pipeline di selezione"
        description="Conversione dei candidati lungo le fasi del processo di recruiting."
        collapsible
        defaultOpen={false}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funnel candidati</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnel.map((stage) => (
              <div key={stage.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{stage.label}</span>
                  <span className="font-medium tabular-nums">{stage.value}</span>
                </div>
                <ProgressBar
                  value={(stage.value / funnelMax) * 100}
                  accent={ACCENT}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section
        id="candidati"
        title="Candidati"
        description="Profili alumni collegati alle posizioni con competenze e stato."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Candidati"
          columns={candidateColumns}
          rows={p1Candidates}
          getRowKey={(candidate) => candidate.profile_code}
        />
      </Section>

      <Section
        id="colloqui"
        title="Colloqui pianificati"
        description="Agenda dei colloqui tecnici e con i partner enterprise."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Colloqui"
          columns={interviewColumns}
          rows={interviews}
          getRowKey={(row, index) => `${row.opening}-${index}`}
        />
      </Section>
    </div>
  );
}
