import {
  DataTable,
  ModuleHeader,
  Section,
  StatusBadge,
  type Column,
} from "@/components/core/module-page";
import { formatDateTime } from "@/lib/begear/format";

interface Connector {
  title: string;
  description: string;
  type: string;
  live: boolean;
  lastSync: string | null;
  records: number;
}

const connectors: Connector[] = [
  {
    title: "Supabase PostgreSQL",
    description: "Database multi-tenant con RLS, sorgente primaria dei dati.",
    type: "Database",
    live: true,
    lastSync: "2026-06-14T10:40:00.000Z",
    records: 18,
  },
  {
    title: "SAP S/4HANA",
    description: "Sandbox e ambienti di laboratorio per l'Academy SAP.",
    type: "ERP",
    live: false,
    lastSync: null,
    records: 0,
  },
  {
    title: "Email / SMTP",
    description: "Notifiche transazionali verso candidati, alumni e partner.",
    type: "Messaging",
    live: false,
    lastSync: null,
    records: 0,
  },
  {
    title: "Calendario",
    description: "Sincronizzazione turni, colloqui e sessioni d'aula.",
    type: "Calendar",
    live: false,
    lastSync: null,
    records: 0,
  },
  {
    title: "Storage documentale",
    description: "Archiviazione di contratti, attestati e CV.",
    type: "Storage",
    live: false,
    lastSync: null,
    records: 0,
  },
];

interface SyncEvent {
  at: string;
  connector: string;
  direction: string;
  records: number;
  ok: boolean;
}

const syncEvents: SyncEvent[] = [
  {
    at: "2026-06-14T10:40:00.000Z",
    connector: "Supabase PostgreSQL",
    direction: "Inbound",
    records: 18,
    ok: true,
  },
  {
    at: "2026-06-14T06:00:00.000Z",
    connector: "Supabase PostgreSQL",
    direction: "Inbound",
    records: 18,
    ok: true,
  },
  {
    at: "2026-06-13T22:15:00.000Z",
    connector: "SAP S/4HANA",
    direction: "Outbound",
    records: 0,
    ok: false,
  },
  {
    at: "2026-06-13T18:30:00.000Z",
    connector: "Email / SMTP",
    direction: "Outbound",
    records: 12,
    ok: true,
  },
];

export default function IntegrationHubPage() {
  const live = connectors.filter((connector) => connector.live).length;

  const connectorColumns: Column<Connector>[] = [
    {
      key: "title",
      header: "Sistema",
      render: (connector) => (
        <div>
          <p className="font-medium">{connector.title}</p>
          <p className="text-xs text-muted-foreground">{connector.description}</p>
        </div>
      ),
    },
    { key: "type", header: "Tipo", render: (connector) => connector.type },
    {
      key: "lastSync",
      header: "Ultima sync",
      render: (connector) =>
        connector.lastSync ? formatDateTime(connector.lastSync) : "—",
    },
    {
      key: "status",
      header: "Stato",
      render: (connector) => (
        <StatusBadge tone={connector.live ? "green" : "amber"}>
          {connector.live ? "Connesso" : "Predisposto"}
        </StatusBadge>
      ),
    },
  ];

  const syncColumns: Column<SyncEvent>[] = [
    { key: "at", header: "Timestamp", render: (row) => formatDateTime(row.at) },
    {
      key: "connector",
      header: "Connettore",
      render: (row) => <span className="font-medium">{row.connector}</span>,
    },
    { key: "direction", header: "Direzione", render: (row) => row.direction },
    {
      key: "records",
      header: "Record",
      align: "right",
      render: (row) => `${row.records}`,
    },
    {
      key: "ok",
      header: "Esito",
      render: (row) => (
        <StatusBadge tone={row.ok ? "green" : "red"}>
          {row.ok ? "OK" : "Errore"}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="integration-hub"
        stats={[
          { label: "Connettori", value: String(connectors.length) },
          { label: "Attivi", value: String(live) },
          { label: "Predisposti", value: String(connectors.length - live) },
          { label: "Sync 24h", value: String(syncEvents.length) },
        ]}
      />

      <Section
        id="connettori"
        title="Connettori"
        description="Integrazioni con i sistemi esterni, stato e ultima sincronizzazione."
      >
        <DataTable
          caption="Connettori"
          columns={connectorColumns}
          rows={connectors}
          getRowKey={(connector) => connector.title}
        />
      </Section>

      <Section
        id="log"
        title="Log sincronizzazioni"
        description="Eventi di sincronizzazione recenti con direzione ed esito."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Log sincronizzazioni"
          columns={syncColumns}
          rows={syncEvents}
          getRowKey={(row, index) => `${row.connector}-${index}`}
        />
      </Section>
    </div>
  );
}
