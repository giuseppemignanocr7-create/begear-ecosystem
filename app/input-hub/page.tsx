import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataTable,
  MetricGrid,
  MetricTile,
  MiniBars,
  ModuleHeader,
  ProgressBar,
  Section,
  StatusBadge,
  type Column,
  type StatusTone,
} from "@/components/core/module-page";
import { p1Candidates } from "@/lib/begear/foundation-data";

const ACCENT = "#c026d3";

type Candidate = (typeof p1Candidates)[number];

interface Channel {
  title: string;
  description: string;
  leads: number;
  conversion: number;
}

const channels: Channel[] = [
  {
    title: "Sito web",
    description: "Lead commerciali e richieste dai form pubblici.",
    leads: 142,
    conversion: 18,
  },
  {
    title: "Academy",
    description: "Candidature degli alumni al termine dei percorsi.",
    leads: 96,
    conversion: 41,
  },
  {
    title: "Partner enterprise",
    description: "Richieste di staffing e Academy-as-a-Service B2B.",
    leads: 38,
    conversion: 55,
  },
  {
    title: "Referral",
    description: "Segnalazioni da rete professionale e candidati.",
    leads: 27,
    conversion: 33,
  },
];

const trend = [
  { label: "Gen", value: 180 },
  { label: "Feb", value: 210 },
  { label: "Mar", value: 245 },
  { label: "Apr", value: 268 },
  { label: "Mag", value: 290 },
  { label: "Giu", value: 303 },
];

const candidateStatusLabel: Record<string, string> = {
  placement_ready: "Pronto",
  screening: "Screening",
  interviewing: "Colloqui",
};

const candidateStatusTone: Record<string, StatusTone> = {
  placement_ready: "green",
  screening: "amber",
  interviewing: "blue",
};

export default function InputHubPage() {
  const totalLeads = channels.reduce((total, channel) => total + channel.leads, 0);
  const averageConversion = Math.round(
    channels.reduce((total, channel) => total + channel.conversion, 0) /
      channels.length,
  );

  const channelColumns: Column<Channel>[] = [
    {
      key: "title",
      header: "Canale",
      render: (channel) => (
        <div>
          <p className="font-medium">{channel.title}</p>
          <p className="text-xs text-muted-foreground">{channel.description}</p>
        </div>
      ),
    },
    {
      key: "leads",
      header: "Lead",
      align: "right",
      render: (channel) => channel.leads.toLocaleString("it-IT"),
    },
    {
      key: "conversion",
      header: "Conversione",
      render: (channel) => (
        <div className="flex min-w-[150px] items-center gap-2">
          <ProgressBar value={channel.conversion} accent={ACCENT} />
          <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {channel.conversion}%
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: () => <StatusBadge tone="green">Attivo</StatusBadge>,
    },
  ];

  const entryColumns: Column<Candidate>[] = [
    {
      key: "name",
      header: "Profilo",
      render: (candidate) => (
        <span className="font-medium">{candidate.display_name}</span>
      ),
    },
    { key: "source", header: "Origine", render: (candidate) => candidate.source },
    {
      key: "headline",
      header: "Profilo sintetico",
      render: (candidate) => (
        <span className="text-xs text-muted-foreground">{candidate.headline}</span>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: (candidate) => (
        <StatusBadge tone={candidateStatusTone[candidate.status] ?? "gray"}>
          {candidateStatusLabel[candidate.status] ?? candidate.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="input-hub"
        stats={[
          { label: "Canali", value: String(channels.length) },
          { label: "Lead totali", value: totalLeads.toLocaleString("it-IT") },
          { label: "Conversione media", value: `${averageConversion}%` },
          { label: "Candidature", value: String(p1Candidates.length) },
        ]}
      />

      <Section
        id="canali"
        title="Canali di ingresso"
        description="Punti unici di acquisizione verso la filiera, con volumi e conversione."
      >
        <MetricGrid>
          <MetricTile
            label="Lead totali"
            value={totalLeads.toLocaleString("it-IT")}
            accent={ACCENT}
          />
          <MetricTile
            label="Conversione media"
            value={`${averageConversion}%`}
            accent="#2563eb"
          />
          <MetricTile
            label="Canali attivi"
            value={String(channels.length)}
            accent="#059669"
          />
          <MetricTile
            label="Candidature gestite"
            value={String(p1Candidates.length)}
            accent="#7c3aed"
          />
        </MetricGrid>
        <DataTable
          caption="Canali di ingresso"
          columns={channelColumns}
          rows={channels}
          getRowKey={(channel) => channel.title}
        />
      </Section>

      <Section
        id="andamento"
        title="Andamento lead"
        description="Volume di lead acquisiti negli ultimi sei mesi."
        collapsible
        defaultOpen={false}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead per mese</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniBars points={trend} accent={ACCENT} />
          </CardContent>
        </Card>
      </Section>

      <Section
        id="ingressi"
        title="Ingressi recenti"
        description="Provenienza e stato degli ultimi profili acquisiti."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Ingressi recenti"
          columns={entryColumns}
          rows={p1Candidates}
          getRowKey={(candidate) => candidate.profile_code}
        />
      </Section>
    </div>
  );
}
