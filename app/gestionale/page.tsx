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
} from "@/components/core/module-page";
import {
  p1Allocations,
  p1BusinessAccounts,
  p1Projects,
} from "@/lib/begear/foundation-data";
import {
  assetStatusLabel,
  assetStatusTone,
  campaignStatusLabel,
  campaignStatusTone,
  erpItAssets,
  erpItTickets,
  erpKpi,
  erpMarketingCampaigns,
  erpPurchaseInvoices,
  erpQuotes,
  erpReceivablesAging,
  erpSalesInvoices,
  erpSalesOrders,
  erpSuppliers,
  invoiceStatusLabel,
  invoiceStatusTone,
  orderStatusLabel,
  orderStatusTone,
  payableStatusLabel,
  payableStatusTone,
  quoteStatusLabel,
  quoteStatusTone,
  ticketPriorityLabel,
  ticketPriorityTone,
  ticketStatusLabel,
  ticketStatusTone,
  type ItAsset,
  type ItTicket,
  type MarketingCampaign,
  type PurchaseInvoice,
  type Quote,
  type SalesInvoice,
  type SalesOrder,
  type Supplier,
} from "@/lib/begear/erp-data";
import { formatCurrency, formatDate } from "@/lib/begear/format";

const ACCENT = "#0891b2";
const AGING_ACCENT = ["#059669", "#d97706", "#ea580c", "#dc2626"] as const;

type ProjectRow = (typeof p1Projects)[number];

const clientShortNames: Record<string, string> = {
  "Enterprise SAP Transformation S.p.A.": "Enterprise SAP",
  "Digital Banking Partner S.p.A.": "Digital Banking",
  "Manufacturing Cloud Group S.r.l.": "Manufacturing Cloud",
};

function shortClient(name: string): string {
  return clientShortNames[name] ?? name;
}

function accountName(accountId: string): string {
  return (
    p1BusinessAccounts.find((account) => account.id === accountId)?.legal_name ??
    "Account"
  );
}

function orderForProject(projectCode: string): SalesOrder | undefined {
  return erpSalesOrders.find((order) => order.project_code === projectCode);
}

function teamCount(projectId: string): number {
  return p1Allocations.filter(
    (allocation) =>
      allocation.project_id === projectId && allocation.status === "active",
  ).length;
}

function billingBar(pct: number) {
  return (
    <div className="flex min-w-[150px] items-center gap-2">
      <ProgressBar value={pct} accent={ACCENT} />
      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {pct}%
      </span>
    </div>
  );
}

export default function GestionalePage() {
  const activeProjects = p1Projects.filter(
    (project) => project.status === "active",
  ).length;
  const openQuotes = erpQuotes.filter(
    (quote) => quote.status === "sent" || quote.status === "draft",
  ).length;
  const decidedQuotes = erpQuotes.filter(
    (quote) => quote.status === "accepted" || quote.status === "lost",
  ).length;
  const wonQuotes = erpQuotes.filter((quote) => quote.status === "accepted")
    .length;
  const winRate = decidedQuotes
    ? Math.round((wonQuotes / decidedQuotes) * 100)
    : 0;
  const issuedInvoices = erpSalesInvoices.filter(
    (invoice) => invoice.status !== "draft",
  ).length;
  const marketingSpendPct = erpKpi.marketingBudgetCents
    ? Math.round(
        (erpKpi.marketingSpendCents / erpKpi.marketingBudgetCents) * 100,
      )
    : 0;
  const leadToSql = erpKpi.marketingLeads
    ? Math.round((erpKpi.marketingSql / erpKpi.marketingLeads) * 100)
    : 0;
  const renewalsDue = erpItAssets.filter(
    (asset) => asset.status === "renewal_due",
  ).length;
  const netPosition =
    erpKpi.receivablesOutstandingCents - erpKpi.payablesOutstandingCents;
  const channelPoints = erpMarketingCampaigns.map((campaign) => ({
    label: campaign.channel,
    value: campaign.leads,
  }));

  const quoteColumns: Column<Quote>[] = [
    {
      key: "code",
      header: "Offerta",
      render: (quote) => <span className="font-medium">{quote.code}</span>,
    },
    { key: "client", header: "Cliente", render: (quote) => shortClient(quote.client) },
    { key: "title", header: "Oggetto", render: (quote) => quote.title },
    { key: "owner", header: "Owner", render: (quote) => quote.owner },
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
      key: "valid",
      header: "Validita",
      render: (quote) => formatDate(quote.valid_until),
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

  const orderColumns: Column<SalesOrder>[] = [
    {
      key: "code",
      header: "Ordine",
      render: (order) => <span className="font-medium">{order.code}</span>,
    },
    { key: "client", header: "Cliente", render: (order) => shortClient(order.client) },
    {
      key: "project",
      header: "Commessa",
      render: (order) => (
        <span className="font-mono text-xs">{order.project_code}</span>
      ),
    },
    {
      key: "amount",
      header: "Valore",
      align: "right",
      render: (order) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(order.amount_cents)}
        </span>
      ),
    },
    {
      key: "progress",
      header: "Fatturato",
      render: (order) => billingBar(order.invoiced_pct),
    },
    {
      key: "delivery",
      header: "Consegna",
      render: (order) => formatDate(order.delivery_date),
    },
    {
      key: "status",
      header: "Stato",
      render: (order) => (
        <StatusBadge tone={orderStatusTone[order.status]}>
          {orderStatusLabel[order.status]}
        </StatusBadge>
      ),
    },
  ];

  const invoiceColumns: Column<SalesInvoice>[] = [
    {
      key: "number",
      header: "Fattura",
      render: (invoice) => <span className="font-medium">{invoice.number}</span>,
    },
    {
      key: "client",
      header: "Cliente",
      render: (invoice) => shortClient(invoice.client),
    },
    {
      key: "taxable",
      header: "Imponibile",
      align: "right",
      render: (invoice) => (
        <span className="tabular-nums">{formatCurrency(invoice.taxable_cents)}</span>
      ),
    },
    {
      key: "vat",
      header: "IVA",
      align: "right",
      render: (invoice) => (
        <span className="tabular-nums text-muted-foreground">
          {formatCurrency(invoice.vat_cents)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Totale",
      align: "right",
      render: (invoice) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(invoice.total_cents)}
        </span>
      ),
    },
    {
      key: "due",
      header: "Scadenza",
      render: (invoice) => formatDate(invoice.due_date),
    },
    {
      key: "status",
      header: "Stato",
      render: (invoice) => (
        <StatusBadge tone={invoiceStatusTone[invoice.status]}>
          {invoiceStatusLabel[invoice.status]}
        </StatusBadge>
      ),
    },
  ];

  const payableColumns: Column<PurchaseInvoice>[] = [
    {
      key: "number",
      header: "Fattura",
      render: (row) => <span className="font-medium">{row.number}</span>,
    },
    { key: "supplier", header: "Fornitore", render: (row) => row.supplier },
    { key: "category", header: "Categoria", render: (row) => row.category },
    {
      key: "total",
      header: "Totale",
      align: "right",
      render: (row) => (
        <span className="font-medium tabular-nums">{formatCurrency(row.total_cents)}</span>
      ),
    },
    { key: "due", header: "Scadenza", render: (row) => formatDate(row.due_date) },
    {
      key: "status",
      header: "Stato",
      render: (row) => (
        <StatusBadge tone={payableStatusTone[row.status]}>
          {payableStatusLabel[row.status]}
        </StatusBadge>
      ),
    },
  ];

  const supplierColumns: Column<Supplier>[] = [
    {
      key: "name",
      header: "Fornitore",
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    { key: "category", header: "Categoria", render: (row) => row.category },
    { key: "terms", header: "Termini", render: (row) => row.payment_terms },
    {
      key: "ytd",
      header: "Speso YTD",
      align: "right",
      render: (row) => (
        <span className="tabular-nums">{formatCurrency(row.ytd_spend_cents)}</span>
      ),
    },
  ];

  const projectColumns: Column<ProjectRow>[] = [
    {
      key: "name",
      header: "Commessa",
      render: (project) => (
        <div>
          <p className="font-medium">{project.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {project.project_code}
          </p>
        </div>
      ),
    },
    {
      key: "client",
      header: "Cliente",
      render: (project) => shortClient(accountName(project.account_id)),
    },
    {
      key: "line",
      header: "Linea di servizio",
      render: (project) => project.service_line,
    },
    {
      key: "period",
      header: "Periodo",
      render: (project) =>
        `${formatDate(project.start_date)} - ${formatDate(project.end_date)}`,
    },
    {
      key: "budget",
      header: "Budget",
      align: "right",
      render: (project) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(project.budget_cents)}
        </span>
      ),
    },
    {
      key: "billing",
      header: "Fatturato",
      render: (project) => billingBar(orderForProject(project.project_code)?.invoiced_pct ?? 0),
    },
    {
      key: "team",
      header: "Team",
      align: "right",
      render: (project) => `${teamCount(project.id)}`,
    },
    {
      key: "status",
      header: "Stato",
      render: (project) => (
        <StatusBadge
          tone={
            project.status === "active"
              ? "green"
              : project.status === "planned"
                ? "blue"
                : "gray"
          }
        >
          {project.status === "active"
            ? "Attivo"
            : project.status === "planned"
              ? "Pianificato"
              : "Chiuso"}
        </StatusBadge>
      ),
    },
  ];

  const campaignColumns: Column<MarketingCampaign>[] = [
    {
      key: "name",
      header: "Campagna",
      render: (campaign) => (
        <div>
          <p className="font-medium">{campaign.name}</p>
          <p className="text-xs text-muted-foreground">{campaign.code}</p>
        </div>
      ),
    },
    { key: "channel", header: "Canale", render: (campaign) => campaign.channel },
    {
      key: "status",
      header: "Stato",
      render: (campaign) => (
        <StatusBadge tone={campaignStatusTone[campaign.status]}>
          {campaignStatusLabel[campaign.status]}
        </StatusBadge>
      ),
    },
    {
      key: "spend",
      header: "Speso",
      align: "right",
      render: (campaign) => (
        <span className="tabular-nums">{formatCurrency(campaign.spend_cents)}</span>
      ),
    },
    {
      key: "leads",
      header: "Lead",
      align: "right",
      render: (campaign) => campaign.leads.toLocaleString("it-IT"),
    },
    {
      key: "sql",
      header: "SQL",
      align: "right",
      render: (campaign) => `${campaign.sql}`,
    },
    {
      key: "cpl",
      header: "CPL",
      align: "right",
      render: (campaign) =>
        campaign.leads
          ? formatCurrency(Math.round(campaign.spend_cents / campaign.leads))
          : "-",
    },
  ];

  const assetColumns: Column<ItAsset>[] = [
    {
      key: "name",
      header: "Sistema",
      render: (asset) => <span className="font-medium">{asset.name}</span>,
    },
    { key: "type", header: "Tipo", render: (asset) => asset.type },
    { key: "vendor", header: "Vendor", render: (asset) => asset.vendor },
    { key: "seats", header: "Copertura", render: (asset) => asset.seats },
    {
      key: "cost",
      header: "Costo annuo",
      align: "right",
      render: (asset) => (
        <span className="tabular-nums">{formatCurrency(asset.annual_cost_cents)}</span>
      ),
    },
    {
      key: "renewal",
      header: "Rinnovo",
      render: (asset) => formatDate(asset.renewal_date),
    },
    {
      key: "status",
      header: "Stato",
      render: (asset) => (
        <StatusBadge tone={assetStatusTone[asset.status]}>
          {assetStatusLabel[asset.status]}
        </StatusBadge>
      ),
    },
  ];

  const ticketColumns: Column<ItTicket>[] = [
    {
      key: "code",
      header: "Ticket",
      render: (ticket) => <span className="font-mono text-xs">{ticket.code}</span>,
    },
    {
      key: "subject",
      header: "Oggetto",
      render: (ticket) => <span className="font-medium">{ticket.subject}</span>,
    },
    { key: "area", header: "Area", render: (ticket) => ticket.area },
    {
      key: "priority",
      header: "Priorita",
      render: (ticket) => (
        <StatusBadge tone={ticketPriorityTone[ticket.priority]}>
          {ticketPriorityLabel[ticket.priority]}
        </StatusBadge>
      ),
    },
    { key: "sla", header: "SLA", align: "right", render: (ticket) => ticket.sla },
    {
      key: "status",
      header: "Stato",
      render: (ticket) => (
        <StatusBadge tone={ticketStatusTone[ticket.status]}>
          {ticketStatusLabel[ticket.status]}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="gestionale"
        stats={[
          {
            label: "Pipeline aperta",
            value: formatCurrency(erpKpi.openPipelineCents),
            hint: `ponderata ${formatCurrency(erpKpi.weightedPipelineCents)}`,
          },
          {
            label: "Backlog ordini",
            value: formatCurrency(erpKpi.ordersBacklogCents),
          },
          {
            label: "Da incassare",
            value: formatCurrency(erpKpi.receivablesOutstandingCents),
            hint: `scaduto ${formatCurrency(erpKpi.overdueReceivablesCents)}`,
          },
          {
            label: "Progetti attivi",
            value: `${activeProjects}/${p1Projects.length}`,
          },
        ]}
      />

      <Section
        id="vendite"
        title="Vendite e offerte"
        description="Pipeline commerciale B2B: offerte, probabilita e valore ponderato."
      >
        <MetricGrid>
          <MetricTile
            label="Pipeline aperta"
            value={formatCurrency(erpKpi.openPipelineCents)}
            hint={`${openQuotes} offerte in corso`}
            accent="#2563eb"
          />
          <MetricTile
            label="Valore ponderato"
            value={formatCurrency(erpKpi.weightedPipelineCents)}
            hint="per probabilita di chiusura"
            accent={ACCENT}
          />
          <MetricTile
            label="Vinto nel periodo"
            value={formatCurrency(erpKpi.wonQuarterCents)}
            hint="offerte accettate"
            accent="#059669"
          />
          <MetricTile
            label="Win rate"
            value={`${winRate}%`}
            hint={`${wonQuotes} vinte su ${decidedQuotes} decise`}
            accent="#7c3aed"
          />
        </MetricGrid>
        <DataTable
          caption="Offerte commerciali"
          columns={quoteColumns}
          rows={erpQuotes}
          getRowKey={(quote) => quote.code}
        />
      </Section>

      <Section
        id="ordini"
        title="Ordini e backlog"
        description="Ordini confermati collegati alle commesse, con avanzamento di fatturazione."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Ordini di vendita"
          columns={orderColumns}
          rows={erpSalesOrders}
          getRowKey={(order) => order.code}
        />
      </Section>

      <Section
        id="fatturazione"
        title="Fatturazione attiva"
        description="Fatture emesse verso i clienti, con imponibile, IVA e stato incasso."
        collapsible
        defaultOpen={false}
      >
        <MetricGrid>
          <MetricTile
            label="Incassato YTD"
            value={formatCurrency(erpKpi.paidYtdCents)}
            accent="#059669"
          />
          <MetricTile
            label="Da incassare"
            value={formatCurrency(erpKpi.receivablesOutstandingCents)}
            accent="#d97706"
          />
          <MetricTile
            label="Scaduto"
            value={formatCurrency(erpKpi.overdueReceivablesCents)}
            accent="#dc2626"
          />
          <MetricTile
            label="Fatture emesse"
            value={`${issuedInvoices}`}
            hint={`${erpSalesInvoices.length} documenti totali`}
            accent={ACCENT}
          />
        </MetricGrid>
        <DataTable
          caption="Fatture attive"
          columns={invoiceColumns}
          rows={erpSalesInvoices}
          getRowKey={(invoice) => invoice.number}
        />
      </Section>

      <Section
        id="acquisti"
        title="Acquisti e fatture passive"
        description="Costi e fornitori: fatture da pagare, scadenze e spesa annua per partner."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Fatture passive"
          columns={payableColumns}
          rows={erpPurchaseInvoices}
          getRowKey={(row) => row.number}
        />
        <p className="pt-2 text-sm font-medium text-muted-foreground">
          Fornitori principali
        </p>
        <DataTable
          caption="Fornitori"
          columns={supplierColumns}
          rows={erpSuppliers}
          getRowKey={(row) => row.name}
        />
      </Section>

      <Section
        id="scadenzario"
        title="Scadenzario e cash flow"
        description="Aging dei crediti e posizione netta tra incassi attesi e pagamenti."
        collapsible
        defaultOpen={false}
      >
        <MetricGrid>
          {erpReceivablesAging.map((bucket, index) => (
            <MetricTile
              key={bucket.label}
              label={bucket.label}
              value={formatCurrency(bucket.amount_cents)}
              hint={`${bucket.count} fatture`}
              accent={AGING_ACCENT[index] ?? ACCENT}
            />
          ))}
        </MetricGrid>
        <Card>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Crediti aperti</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatCurrency(erpKpi.receivablesOutstandingCents)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Debiti aperti</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatCurrency(erpKpi.payablesOutstandingCents)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Posizione netta</p>
              <p
                className="mt-1 text-xl font-semibold tabular-nums"
                style={{ color: netPosition >= 0 ? "#059669" : "#dc2626" }}
              >
                {formatCurrency(netPosition)}
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="progetti"
        title="Progetti"
        description="Commesse collegate ad account, linee di servizio e avanzamento di fatturazione."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Commesse e progetti"
          columns={projectColumns}
          rows={p1Projects}
          getRowKey={(project) => project.project_code}
        />
      </Section>

      <Section
        id="marketing"
        title="Marketing"
        description="Campagne di acquisizione, spesa, lead generati e qualificazione commerciale."
        collapsible
        defaultOpen={false}
      >
        <MetricGrid>
          <MetricTile
            label="Budget marketing"
            value={formatCurrency(erpKpi.marketingBudgetCents)}
            accent="#7c3aed"
          />
          <MetricTile
            label="Speso"
            value={formatCurrency(erpKpi.marketingSpendCents)}
            hint={`${marketingSpendPct}% del budget`}
            accent={ACCENT}
          />
          <MetricTile
            label="Lead generati"
            value={erpKpi.marketingLeads.toLocaleString("it-IT")}
            accent="#2563eb"
          />
          <MetricTile
            label="SQL"
            value={`${erpKpi.marketingSql}`}
            hint={`${leadToSql}% conversione lead`}
            accent="#059669"
          />
        </MetricGrid>
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <DataTable
            caption="Campagne marketing"
            columns={campaignColumns}
            rows={erpMarketingCampaigns}
            getRowKey={(campaign) => campaign.code}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead per canale</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniBars points={channelPoints} accent="#7c3aed" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="it"
        title="IT e infrastruttura"
        description="Sistemi, licenze, costi annui e ticket di assistenza interni."
        collapsible
        defaultOpen={false}
      >
        <MetricGrid>
          <MetricTile
            label="Costo annuo IT"
            value={formatCurrency(erpKpi.itAnnualCostCents)}
            accent={ACCENT}
          />
          <MetricTile
            label="Sistemi monitorati"
            value={`${erpItAssets.length}`}
            accent="#2563eb"
          />
          <MetricTile
            label="Rinnovi in scadenza"
            value={`${renewalsDue}`}
            accent="#dc2626"
          />
          <MetricTile
            label="Ticket aperti"
            value={`${erpKpi.openTickets}`}
            hint={`${erpItTickets.length} totali`}
            accent="#d97706"
          />
        </MetricGrid>
        <DataTable
          caption="Sistemi e licenze"
          columns={assetColumns}
          rows={erpItAssets}
          getRowKey={(asset) => asset.name}
        />
        <p className="pt-2 text-sm font-medium text-muted-foreground">
          Ticket di assistenza
        </p>
        <DataTable
          caption="Ticket IT"
          columns={ticketColumns}
          rows={erpItTickets}
          getRowKey={(ticket) => ticket.code}
        />
      </Section>
    </div>
  );
}
