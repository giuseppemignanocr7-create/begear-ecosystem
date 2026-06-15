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
import { p1BusinessAccounts, p1Projects } from "@/lib/begear/foundation-data";
import {
  erpKpi,
  erpQuotes,
  erpSalesInvoices,
  quoteStatusLabel,
  quoteStatusTone,
  type Quote,
} from "@/lib/begear/erp-data";
import { formatCurrency, formatDate } from "@/lib/begear/format";

const ACCENT = "#db2777";

type Account = (typeof p1BusinessAccounts)[number];

const accountStatusLabel: Record<string, string> = {
  qualified: "Qualificato",
  proposal: "Proposta",
  active: "Attivo",
  lost: "Perso",
};

const accountStatusTone: Record<string, StatusTone> = {
  qualified: "blue",
  proposal: "amber",
  active: "green",
  lost: "red",
};

const shortNames: Record<string, string> = {
  "Enterprise SAP Transformation S.p.A.": "Enterprise SAP",
  "Digital Banking Partner S.p.A.": "Digital Banking",
  "Manufacturing Cloud Group S.r.l.": "Manufacturing Cloud",
};

const ownerByAccount: Record<string, string> = {
  "Enterprise SAP Transformation S.p.A.": "M. De Santis",
  "Digital Banking Partner S.p.A.": "M. De Santis",
  "Manufacturing Cloud Group S.r.l.": "L. Ferraro",
};

function short(name: string): string {
  return shortNames[name] ?? name;
}

function projectCount(accountId: string): number {
  return p1Projects.filter((project) => project.account_id === accountId).length;
}

function paidForClient(legalName: string): number {
  return erpSalesInvoices
    .filter((invoice) => invoice.client === legalName && invoice.status === "paid")
    .reduce((total, invoice) => total + invoice.total_cents, 0);
}

interface CrmActivity {
  date: string;
  account: string;
  type: string;
  subject: string;
  owner: string;
  done: boolean;
}

const crmActivities: CrmActivity[] = [
  {
    date: "2026-06-16",
    account: "Enterprise SAP",
    type: "Meeting",
    subject: "Review estensione AMS Payroll",
    owner: "M. De Santis",
    done: false,
  },
  {
    date: "2026-06-12",
    account: "Digital Banking",
    type: "Demo",
    subject: "Demo piattaforma GRC & Cybersecurity",
    owner: "M. De Santis",
    done: true,
  },
  {
    date: "2026-06-18",
    account: "Manufacturing Cloud",
    type: "Call",
    subject: "Allineamento Cloud Ops Pod Q3",
    owner: "L. Ferraro",
    done: false,
  },
  {
    date: "2026-06-10",
    account: "Digital Banking",
    type: "Email",
    subject: "Invio proposta assessment ISO 27001",
    owner: "M. De Santis",
    done: true,
  },
  {
    date: "2026-06-20",
    account: "Enterprise SAP",
    type: "Call",
    subject: "Negoziazione rinnovo annuale AMS",
    owner: "M. De Santis",
    done: false,
  },
];

interface CrmContact {
  account: string;
  name: string;
  role: string;
  email: string;
}

const crmContacts: CrmContact[] = [
  {
    account: "Enterprise SAP",
    name: "Chiara Bianchi",
    role: "CIO",
    email: "c.bianchi@enterprise-sap.example",
  },
  {
    account: "Enterprise SAP",
    name: "Marco Conti",
    role: "Head of Finance IT",
    email: "m.conti@enterprise-sap.example",
  },
  {
    account: "Digital Banking",
    name: "Sara Greco",
    role: "CISO",
    email: "s.greco@digitalbanking.example",
  },
  {
    account: "Manufacturing Cloud",
    name: "Luca Moretti",
    role: "COO",
    email: "l.moretti@mcloud.example",
  },
  {
    account: "Manufacturing Cloud",
    name: "Elena Rizzo",
    role: "IT Procurement",
    email: "e.rizzo@mcloud.example",
  },
];

export default function CrmPage() {
  const decided = erpQuotes.filter(
    (quote) => quote.status === "accepted" || quote.status === "lost",
  ).length;
  const won = erpQuotes.filter((quote) => quote.status === "accepted").length;
  const winRate = decided ? Math.round((won / decided) * 100) : 0;
  const openTasks = crmActivities.filter((activity) => !activity.done).length;

  const pipelineColumns: Column<Quote>[] = [
    {
      key: "code",
      header: "Offerta",
      render: (quote) => <span className="font-medium">{quote.code}</span>,
    },
    { key: "client", header: "Account", render: (quote) => short(quote.client) },
    { key: "title", header: "Oggetto", render: (quote) => quote.title },
    {
      key: "amount",
      header: "Valore",
      align: "right",
      render: (quote) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(quote.amount_cents)}
        </span>
      ),
    },
    {
      key: "prob",
      header: "Prob.",
      align: "right",
      render: (quote) => `${quote.probability}%`,
    },
    {
      key: "status",
      header: "Stato",
      render: (quote) => (
        <StatusBadge tone={quoteStatusTone[quote.status]}>
          {quoteStatusLabel[quote.status]}
        </StatusBadge>
      ),
    },
  ];

  const accountColumns: Column<Account>[] = [
    {
      key: "name",
      header: "Ragione sociale",
      render: (account) => (
        <div>
          <p className="font-medium">{account.legal_name}</p>
          <p className="text-xs text-muted-foreground">{account.industry}</p>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (account) => ownerByAccount[account.legal_name] ?? "-",
    },
    {
      key: "projects",
      header: "Progetti",
      align: "right",
      render: (account) => `${projectCount(account.id)}`,
    },
    {
      key: "revenue",
      header: "Fatturato incassato",
      align: "right",
      render: (account) => (
        <span className="tabular-nums">
          {formatCurrency(paidForClient(account.legal_name))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: (account) => (
        <StatusBadge tone={accountStatusTone[account.status] ?? "gray"}>
          {accountStatusLabel[account.status] ?? account.status}
        </StatusBadge>
      ),
    },
  ];

  const activityColumns: Column<CrmActivity>[] = [
    { key: "date", header: "Data", render: (row) => formatDate(row.date) },
    { key: "account", header: "Account", render: (row) => row.account },
    { key: "type", header: "Tipo", render: (row) => row.type },
    {
      key: "subject",
      header: "Oggetto",
      render: (row) => <span className="font-medium">{row.subject}</span>,
    },
    { key: "owner", header: "Owner", render: (row) => row.owner },
    {
      key: "status",
      header: "Stato",
      render: (row) => (
        <StatusBadge tone={row.done ? "green" : "amber"}>
          {row.done ? "Completata" : "Da fare"}
        </StatusBadge>
      ),
    },
  ];

  const contactColumns: Column<CrmContact>[] = [
    {
      key: "name",
      header: "Contatto",
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    { key: "role", header: "Ruolo", render: (row) => row.role },
    { key: "account", header: "Account", render: (row) => row.account },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span className="text-muted-foreground">{row.email}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="crm"
        stats={[
          {
            label: "Pipeline aperta",
            value: formatCurrency(erpKpi.openPipelineCents),
            hint: `${erpQuotes.length} offerte`,
          },
          { label: "Account", value: String(p1BusinessAccounts.length) },
          { label: "Win rate", value: `${winRate}%` },
          { label: "Attività aperte", value: String(openTasks) },
        ]}
      />

      <Section
        id="pipeline"
        title="Pipeline commerciale"
        description="Offerte B2B per stato, valore e probabilità di chiusura."
      >
        <MetricGrid>
          <MetricTile
            label="Pipeline aperta"
            value={formatCurrency(erpKpi.openPipelineCents)}
            accent="#2563eb"
          />
          <MetricTile
            label="Valore ponderato"
            value={formatCurrency(erpKpi.weightedPipelineCents)}
            accent={ACCENT}
          />
          <MetricTile
            label="Vinto nel periodo"
            value={formatCurrency(erpKpi.wonQuarterCents)}
            accent="#059669"
          />
          <MetricTile
            label="Win rate"
            value={`${winRate}%`}
            hint={`${won} vinte su ${decided}`}
            accent="#7c3aed"
          />
        </MetricGrid>
        <DataTable
          caption="Pipeline offerte"
          columns={pipelineColumns}
          rows={erpQuotes}
          getRowKey={(quote) => quote.code}
        />
      </Section>

      <Section
        id="account"
        title="Account enterprise"
        description="Clienti B2B con owner, progetti collegati e fatturato incassato."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Account enterprise"
          columns={accountColumns}
          rows={p1BusinessAccounts}
          getRowKey={(account) => account.id}
        />
      </Section>

      <Section
        id="attivita"
        title="Attività e prossimi passi"
        description="Agenda commerciale: call, meeting, demo ed email per account."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Attività CRM"
          columns={activityColumns}
          rows={crmActivities}
          getRowKey={(row, index) => `${row.account}-${index}`}
        />
      </Section>

      <Section
        id="contatti"
        title="Contatti chiave"
        description="Referenti decisionali presso gli account enterprise."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Contatti"
          columns={contactColumns}
          rows={crmContacts}
          getRowKey={(row) => row.email}
        />
      </Section>
    </div>
  );
}
