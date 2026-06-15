import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataTable,
  ModuleHeader,
  ProgressBar,
  Section,
  StatusBadge,
  type Column,
} from "@/components/core/module-page";
import {
  p1Candidates,
  p1JobOpenings,
  p1Placements,
} from "@/lib/begear/foundation-data";
import { formatDate } from "@/lib/begear/format";

const ACCENT = "#d97706";

type Placement = (typeof p1Placements)[number];

function candidateName(candidateId: string): string {
  return (
    p1Candidates.find((candidate) => candidate.id === candidateId)
      ?.display_name ?? "Profilo alumni"
  );
}

function openingTitle(openingId: string): string {
  return (
    p1JobOpenings.find((opening) => opening.id === openingId)?.title ??
    "Posizione"
  );
}

const funnel = [
  { label: "Alumni idonei", value: 32 },
  { label: "In coaching", value: 18 },
  { label: "Presentati a partner", value: 11 },
  { label: "Colloqui partner", value: 6 },
  { label: "Inseriti", value: 3 },
];

interface Partner {
  name: string;
  sector: string;
  openings: number;
  placed: number;
}

const partners: Partner[] = [
  {
    name: "Enterprise SAP Transformation",
    sector: "Consulenza SAP enterprise",
    openings: 4,
    placed: 2,
  },
  {
    name: "Digital Banking Partner",
    sector: "Financial services technology",
    openings: 3,
    placed: 1,
  },
  {
    name: "Manufacturing Cloud Group",
    sector: "Industria e cloud operations",
    openings: 2,
    placed: 1,
  },
  {
    name: "GovTech Solutions",
    sector: "Pubblica amministrazione",
    openings: 2,
    placed: 0,
  },
];

export default function PlacementPage() {
  const placed = p1Placements.filter(
    (placement) => placement.placed_at !== null,
  ).length;
  const inProgress = p1Placements.length - placed;
  const funnelMax = funnel[0]?.value ?? 1;

  const outcomeColumns: Column<Placement>[] = [
    {
      key: "candidate",
      header: "Candidato",
      render: (placement) => (
        <span className="font-medium">
          {candidateName(placement.candidate_id)}
        </span>
      ),
    },
    {
      key: "opening",
      header: "Posizione",
      render: (placement) => openingTitle(placement.job_opening_id),
    },
    {
      key: "outcome",
      header: "Esito",
      render: (placement) => placement.outcome_label,
    },
    {
      key: "notes",
      header: "Note coaching",
      render: (placement) => (
        <span className="text-xs text-muted-foreground">
          {placement.coaching_notes}
        </span>
      ),
    },
    {
      key: "date",
      header: "Inserimento",
      render: (placement) =>
        placement.placed_at ? formatDate(placement.placed_at) : "Da confermare",
    },
    {
      key: "status",
      header: "Stato",
      render: (placement) => (
        <StatusBadge tone={placement.placed_at ? "green" : "amber"}>
          {placement.placed_at ? "Inserito" : "In corso"}
        </StatusBadge>
      ),
    },
  ];

  const partnerColumns: Column<Partner>[] = [
    {
      key: "name",
      header: "Partner",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.sector}</p>
        </div>
      ),
    },
    {
      key: "openings",
      header: "Posizioni aperte",
      align: "right",
      render: (row) => `${row.openings}`,
    },
    {
      key: "placed",
      header: "Inserimenti",
      align: "right",
      render: (row) => `${row.placed}`,
    },
    {
      key: "rate",
      header: "Copertura",
      render: (row) => (
        <div className="flex min-w-[140px] items-center gap-2">
          <ProgressBar
            value={row.openings ? (row.placed / row.openings) * 100 : 0}
            accent={ACCENT}
          />
          <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {row.openings ? Math.round((row.placed / row.openings) * 100) : 0}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="placement"
        stats={[
          { label: "Outcome", value: String(p1Placements.length) },
          { label: "Inseriti", value: String(placed) },
          { label: "In corso", value: String(inProgress) },
          { label: "Target", value: "97%", hint: "entro 6 mesi" },
        ]}
      />

      <Section
        id="outcome"
        title="Outcome di inserimento"
        description="Collegamento tra alumni formati, posizioni partner e note di coaching."
      >
        <DataTable
          caption="Outcome placement"
          columns={outcomeColumns}
          rows={p1Placements}
          getRowKey={(placement) => placement.id}
        />
      </Section>

      <Section
        id="funnel"
        title="Funnel placement"
        description="Avanzamento degli alumni dal coaching all'inserimento in azienda."
        collapsible
        defaultOpen={false}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversione alumni</CardTitle>
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
        id="partner"
        title="Partner di inserimento"
        description="Aziende partner con posizioni aperte e inserimenti completati."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Partner enterprise"
          columns={partnerColumns}
          rows={partners}
          getRowKey={(row) => row.name}
        />
      </Section>
    </div>
  );
}
