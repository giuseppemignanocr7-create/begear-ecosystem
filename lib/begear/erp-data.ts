import type { StatusTone } from "@/components/core/module-page";

/**
 * Dati operativi estesi del Gestionale BeGear (ERP).
 * Coerenti con il seed P1: clienti = business_accounts, commesse = projects.
 * Importi in centesimi di euro per riusare formatCurrency.
 */
export const ERP_TODAY = "2026-06-14";

const VAT_RATE = 0.22;

export type QuoteStatus = "draft" | "sent" | "accepted" | "lost";

export interface Quote {
  code: string;
  client: string;
  title: string;
  owner: string;
  amount_cents: number;
  status: QuoteStatus;
  issued_at: string;
  valid_until: string;
  probability: number;
}

export const erpQuotes: Quote[] = [
  {
    code: "QUO-2026-018",
    client: "Enterprise SAP Transformation S.p.A.",
    title: "Estensione AMS Payroll & Travel Management",
    owner: "M. De Santis",
    amount_cents: 13_500_000,
    status: "sent",
    issued_at: "2026-05-28",
    valid_until: "2026-06-30",
    probability: 65,
  },
  {
    code: "QUO-2026-017",
    client: "Digital Banking Partner S.p.A.",
    title: "GRC & Cybersecurity Rollout",
    owner: "M. De Santis",
    amount_cents: 8_900_000,
    status: "accepted",
    issued_at: "2026-05-12",
    valid_until: "2026-06-15",
    probability: 100,
  },
  {
    code: "QUO-2026-016",
    client: "Manufacturing Cloud Group S.r.l.",
    title: "Cloud Ops Pod Q3-Q4",
    owner: "L. Ferraro",
    amount_cents: 7_200_000,
    status: "sent",
    issued_at: "2026-06-02",
    valid_until: "2026-07-05",
    probability: 55,
  },
  {
    code: "QUO-2026-019",
    client: "Manufacturing Cloud Group S.r.l.",
    title: "Full Stack squad — estensione team",
    owner: "L. Ferraro",
    amount_cents: 4_600_000,
    status: "draft",
    issued_at: "2026-06-11",
    valid_until: "2026-07-20",
    probability: 40,
  },
  {
    code: "QUO-2026-015",
    client: "Enterprise SAP Transformation S.p.A.",
    title: "Academy SAP as-a-Service — 2 edizioni",
    owner: "G. Russo",
    amount_cents: 5_400_000,
    status: "draft",
    issued_at: "2026-06-09",
    valid_until: "2026-07-15",
    probability: 35,
  },
  {
    code: "QUO-2026-012",
    client: "Digital Banking Partner S.p.A.",
    title: "Assessment ISO 27001 spot",
    owner: "M. De Santis",
    amount_cents: 2_800_000,
    status: "lost",
    issued_at: "2026-04-03",
    valid_until: "2026-05-05",
    probability: 0,
  },
];

export type OrderStatus = "confirmed" | "in_delivery" | "completed";

export interface SalesOrder {
  code: string;
  client: string;
  project_code: string;
  title: string;
  amount_cents: number;
  status: OrderStatus;
  start_date: string;
  delivery_date: string;
  invoiced_pct: number;
}

export const erpSalesOrders: SalesOrder[] = [
  {
    code: "ORD-2026-039",
    client: "Enterprise SAP Transformation S.p.A.",
    project_code: "PRJ-SAP-AMS-2026",
    title: "S/4HANA AMS Finance Factory",
    amount_cents: 42_000_000,
    status: "in_delivery",
    start_date: "2026-01-15",
    delivery_date: "2026-12-31",
    invoiced_pct: 45,
  },
  {
    code: "ORD-2026-041",
    client: "Manufacturing Cloud Group S.r.l.",
    project_code: "PRJ-FS-PLATFORM-2026",
    title: "Cloud operations workforce pod",
    amount_cents: 26_000_000,
    status: "in_delivery",
    start_date: "2026-02-01",
    delivery_date: "2026-09-30",
    invoiced_pct: 30,
  },
  {
    code: "ORD-2026-044",
    client: "Digital Banking Partner S.p.A.",
    project_code: "PRJ-CYB-GRC-2026",
    title: "GRC & Cybersecurity Enablement",
    amount_cents: 8_900_000,
    status: "confirmed",
    start_date: "2026-06-16",
    delivery_date: "2026-12-20",
    invoiced_pct: 10,
  },
  {
    code: "ORD-2026-035",
    client: "Enterprise SAP Transformation S.p.A.",
    project_code: "PRJ-SAP-AMS-2026",
    title: "Academy SAP as-a-Service Q1",
    amount_cents: 4_800_000,
    status: "completed",
    start_date: "2026-01-20",
    delivery_date: "2026-04-10",
    invoiced_pct: 100,
  },
];

export type InvoiceStatus = "draft" | "issued" | "sent" | "paid" | "overdue";

export interface SalesInvoice {
  number: string;
  client: string;
  order_code: string | null;
  taxable_cents: number;
  vat_cents: number;
  total_cents: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
}

function withVat(taxable: number): { vat_cents: number; total_cents: number } {
  const vat = Math.round(taxable * VAT_RATE);
  return { vat_cents: vat, total_cents: taxable + vat };
}

export const erpSalesInvoices: SalesInvoice[] = [
  {
    number: "FT-2026-121",
    client: "Enterprise SAP Transformation S.p.A.",
    order_code: "ORD-2026-039",
    taxable_cents: 6_300_000,
    ...withVat(6_300_000),
    status: "sent",
    issue_date: "2026-06-01",
    due_date: "2026-07-01",
    paid_date: null,
  },
  {
    number: "FT-2026-120",
    client: "Manufacturing Cloud Group S.r.l.",
    order_code: "ORD-2026-041",
    taxable_cents: 3_900_000,
    ...withVat(3_900_000),
    status: "issued",
    issue_date: "2026-06-05",
    due_date: "2026-07-05",
    paid_date: null,
  },
  {
    number: "FT-2026-122",
    client: "Enterprise SAP Transformation S.p.A.",
    order_code: "ORD-2026-039",
    taxable_cents: 4_200_000,
    ...withVat(4_200_000),
    status: "draft",
    issue_date: "2026-06-13",
    due_date: "2026-07-13",
    paid_date: null,
  },
  {
    number: "FT-2026-118",
    client: "Digital Banking Partner S.p.A.",
    order_code: "ORD-2026-044",
    taxable_cents: 1_780_000,
    ...withVat(1_780_000),
    status: "overdue",
    issue_date: "2026-04-20",
    due_date: "2026-05-20",
    paid_date: null,
  },
  {
    number: "FT-2026-112",
    client: "Manufacturing Cloud Group S.r.l.",
    order_code: "ORD-2026-041",
    taxable_cents: 1_500_000,
    ...withVat(1_500_000),
    status: "overdue",
    issue_date: "2026-03-28",
    due_date: "2026-05-02",
    paid_date: null,
  },
  {
    number: "FT-2026-104",
    client: "Digital Banking Partner S.p.A.",
    order_code: null,
    taxable_cents: 1_200_000,
    ...withVat(1_200_000),
    status: "overdue",
    issue_date: "2026-03-10",
    due_date: "2026-04-10",
    paid_date: null,
  },
  {
    number: "FT-2026-099",
    client: "Enterprise SAP Transformation S.p.A.",
    order_code: "ORD-2026-035",
    taxable_cents: 4_800_000,
    ...withVat(4_800_000),
    status: "paid",
    issue_date: "2026-03-15",
    due_date: "2026-04-15",
    paid_date: "2026-04-10",
  },
  {
    number: "FT-2026-095",
    client: "Manufacturing Cloud Group S.r.l.",
    order_code: null,
    taxable_cents: 2_600_000,
    ...withVat(2_600_000),
    status: "paid",
    issue_date: "2026-02-28",
    due_date: "2026-03-30",
    paid_date: "2026-03-22",
  },
];

export type PayableStatus = "to_pay" | "scheduled" | "paid" | "overdue";

export interface PurchaseInvoice {
  number: string;
  supplier: string;
  category: string;
  total_cents: number;
  status: PayableStatus;
  issue_date: string;
  due_date: string;
}

export const erpPurchaseInvoices: PurchaseInvoice[] = [
  {
    number: "FP-2026-081",
    supplier: "Workspace Facility S.r.l.",
    category: "Sedi e facility",
    total_cents: 1_220_000,
    status: "to_pay",
    issue_date: "2026-06-05",
    due_date: "2026-07-05",
  },
  {
    number: "FP-2026-077",
    supplier: "Cloud Infrastructure Provider",
    category: "Cloud & hosting",
    total_cents: 1_464_000,
    status: "scheduled",
    issue_date: "2026-06-01",
    due_date: "2026-06-30",
  },
  {
    number: "FP-2026-074",
    supplier: "SAP Licensing Italia",
    category: "Licenze software",
    total_cents: 3_660_000,
    status: "to_pay",
    issue_date: "2026-06-03",
    due_date: "2026-07-03",
  },
  {
    number: "FP-2026-070",
    supplier: "Talent Trainers Pool",
    category: "Formazione",
    total_cents: 2_196_000,
    status: "overdue",
    issue_date: "2026-04-15",
    due_date: "2026-05-15",
  },
  {
    number: "FP-2026-079",
    supplier: "Digital Marketing Agency",
    category: "Marketing",
    total_cents: 976_000,
    status: "paid",
    issue_date: "2026-05-02",
    due_date: "2026-06-01",
  },
];

export interface Supplier {
  name: string;
  category: string;
  payment_terms: string;
  ytd_spend_cents: number;
}

export const erpSuppliers: Supplier[] = [
  {
    name: "SAP Licensing Italia",
    category: "Licenze software",
    payment_terms: "60 gg d.f.",
    ytd_spend_cents: 14_640_000,
  },
  {
    name: "Cloud Infrastructure Provider",
    category: "Cloud & hosting",
    payment_terms: "30 gg d.f.",
    ytd_spend_cents: 8_784_000,
  },
  {
    name: "Workspace Facility S.r.l.",
    category: "Sedi e facility",
    payment_terms: "60 gg d.f.",
    ytd_spend_cents: 7_320_000,
  },
  {
    name: "Talent Trainers Pool",
    category: "Formazione",
    payment_terms: "30 gg d.f.",
    ytd_spend_cents: 6_588_000,
  },
  {
    name: "Digital Marketing Agency",
    category: "Marketing",
    payment_terms: "30 gg d.f.",
    ytd_spend_cents: 3_904_000,
  },
];

export type CampaignChannel =
  | "Google Ads"
  | "LinkedIn"
  | "Email"
  | "Webinar"
  | "Eventi";
export type CampaignStatus = "active" | "planned" | "completed";

export interface MarketingCampaign {
  code: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  budget_cents: number;
  spend_cents: number;
  leads: number;
  mql: number;
  sql: number;
  start_date: string;
}

export const erpMarketingCampaigns: MarketingCampaign[] = [
  {
    code: "MKT-2026-07",
    name: "Master SAP S/4HANA — Lead Gen Q3",
    channel: "Google Ads",
    status: "active",
    budget_cents: 1_200_000,
    spend_cents: 720_000,
    leads: 184,
    mql: 96,
    sql: 38,
    start_date: "2026-06-01",
  },
  {
    code: "MKT-2026-05",
    name: "AI & Cybersecurity Webinar Series",
    channel: "Webinar",
    status: "active",
    budget_cents: 600_000,
    spend_cents: 410_000,
    leads: 142,
    mql: 71,
    sql: 24,
    start_date: "2026-05-10",
  },
  {
    code: "MKT-2026-06",
    name: "Employer Branding ICT",
    channel: "LinkedIn",
    status: "active",
    budget_cents: 900_000,
    spend_cents: 540_000,
    leads: 98,
    mql: 40,
    sql: 12,
    start_date: "2026-05-20",
  },
  {
    code: "MKT-2026-04",
    name: "Alumni Nurturing & Placement",
    channel: "Email",
    status: "completed",
    budget_cents: 300_000,
    spend_cents: 300_000,
    leads: 60,
    mql: 44,
    sql: 21,
    start_date: "2026-03-01",
  },
  {
    code: "MKT-2026-08",
    name: "Open Day Academy Napoli",
    channel: "Eventi",
    status: "planned",
    budget_cents: 500_000,
    spend_cents: 0,
    leads: 0,
    mql: 0,
    sql: 0,
    start_date: "2026-07-15",
  },
];

export type AssetStatus = "operational" | "maintenance" | "renewal_due";

export interface ItAsset {
  name: string;
  type: string;
  vendor: string;
  status: AssetStatus;
  seats: string;
  annual_cost_cents: number;
  renewal_date: string;
}

export const erpItAssets: ItAsset[] = [
  {
    name: "SAP S/4HANA Sandbox",
    type: "Ambiente",
    vendor: "SAP",
    status: "operational",
    seats: "200 consulenti",
    annual_cost_cents: 14_640_000,
    renewal_date: "2027-01-15",
  },
  {
    name: "Microsoft 365 E3",
    type: "SaaS",
    vendor: "Microsoft",
    status: "renewal_due",
    seats: "120 utenti",
    annual_cost_cents: 4_392_000,
    renewal_date: "2026-06-30",
  },
  {
    name: "Supabase Postgres Prod",
    type: "Ambiente",
    vendor: "Supabase",
    status: "operational",
    seats: "Cluster dedicato",
    annual_cost_cents: 2_928_000,
    renewal_date: "2026-11-30",
  },
  {
    name: "CrowdStrike Falcon",
    type: "Sicurezza",
    vendor: "CrowdStrike",
    status: "maintenance",
    seats: "Endpoint flotta",
    annual_cost_cents: 2_196_000,
    renewal_date: "2026-09-01",
  },
  {
    name: "GitLab Ultimate CI/CD",
    type: "SaaS",
    vendor: "GitLab",
    status: "operational",
    seats: "45 sviluppatori",
    annual_cost_cents: 1_830_000,
    renewal_date: "2026-10-10",
  },
];

export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in_progress" | "resolved";

export interface ItTicket {
  code: string;
  subject: string;
  area: string;
  priority: TicketPriority;
  status: TicketStatus;
  opened_at: string;
  sla: string;
}

export const erpItTickets: ItTicket[] = [
  {
    code: "TIC-2050",
    subject: "Aggiornamento certificato TLS portale candidati",
    area: "Sicurezza",
    priority: "critical",
    status: "in_progress",
    opened_at: "2026-06-14",
    sla: "4h",
  },
  {
    code: "TIC-2051",
    subject: "Errore export fatture PDF dal Gestionale",
    area: "Gestionale",
    priority: "high",
    status: "open",
    opened_at: "2026-06-14",
    sla: "8h",
  },
  {
    code: "TIC-2048",
    subject: "Lentezza sincronizzazione Integration Hub ↔ SAP",
    area: "Integrazioni",
    priority: "high",
    status: "in_progress",
    opened_at: "2026-06-13",
    sla: "8h",
  },
  {
    code: "TIC-2046",
    subject: "Reset MFA utenti Academy Lecce",
    area: "Identity",
    priority: "medium",
    status: "resolved",
    opened_at: "2026-06-12",
    sla: "24h",
  },
  {
    code: "TIC-2039",
    subject: "Nuovo ambiente staging team Full Stack",
    area: "DevOps",
    priority: "low",
    status: "resolved",
    opened_at: "2026-06-08",
    sla: "48h",
  },
];

/* Etichette e toni di stato (IT) riusabili nelle viste. */

export const quoteStatusLabel: Record<QuoteStatus, string> = {
  draft: "Bozza",
  sent: "Inviata",
  accepted: "Accettata",
  lost: "Persa",
};

export const quoteStatusTone: Record<QuoteStatus, StatusTone> = {
  draft: "gray",
  sent: "blue",
  accepted: "green",
  lost: "red",
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  confirmed: "Confermato",
  in_delivery: "In delivery",
  completed: "Completato",
};

export const orderStatusTone: Record<OrderStatus, StatusTone> = {
  confirmed: "blue",
  in_delivery: "amber",
  completed: "green",
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: "Bozza",
  issued: "Emessa",
  sent: "Inviata",
  paid: "Pagata",
  overdue: "Scaduta",
};

export const invoiceStatusTone: Record<InvoiceStatus, StatusTone> = {
  draft: "gray",
  issued: "violet",
  sent: "blue",
  paid: "green",
  overdue: "red",
};

export const payableStatusLabel: Record<PayableStatus, string> = {
  to_pay: "Da pagare",
  scheduled: "Schedulata",
  paid: "Pagata",
  overdue: "Scaduta",
};

export const payableStatusTone: Record<PayableStatus, StatusTone> = {
  to_pay: "amber",
  scheduled: "blue",
  paid: "green",
  overdue: "red",
};

export const campaignStatusLabel: Record<CampaignStatus, string> = {
  active: "Attiva",
  planned: "Pianificata",
  completed: "Conclusa",
};

export const campaignStatusTone: Record<CampaignStatus, StatusTone> = {
  active: "green",
  planned: "blue",
  completed: "gray",
};

export const assetStatusLabel: Record<AssetStatus, string> = {
  operational: "Operativo",
  maintenance: "Manutenzione",
  renewal_due: "Rinnovo in scadenza",
};

export const assetStatusTone: Record<AssetStatus, StatusTone> = {
  operational: "green",
  maintenance: "amber",
  renewal_due: "red",
};

export const ticketPriorityLabel: Record<TicketPriority, string> = {
  low: "Bassa",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

export const ticketPriorityTone: Record<TicketPriority, StatusTone> = {
  low: "gray",
  medium: "blue",
  high: "amber",
  critical: "red",
};

export const ticketStatusLabel: Record<TicketStatus, string> = {
  open: "Aperto",
  in_progress: "In corso",
  resolved: "Risolto",
};

export const ticketStatusTone: Record<TicketStatus, StatusTone> = {
  open: "amber",
  in_progress: "blue",
  resolved: "green",
};

/* Aggregati pronti per KPI. */

const sum = (values: number[]): number => values.reduce((total, v) => total + v, 0);

export function daysOverdue(dueDate: string, today: string = ERP_TODAY): number {
  const diff = new Date(today).getTime() - new Date(dueDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export interface AgingBucket {
  label: string;
  amount_cents: number;
  count: number;
}

export const erpReceivablesAging: AgingBucket[] = (() => {
  const buckets: AgingBucket[] = [
    { label: "Non scaduto", amount_cents: 0, count: 0 },
    { label: "1-30 gg", amount_cents: 0, count: 0 },
    { label: "31-60 gg", amount_cents: 0, count: 0 },
    { label: "60+ gg", amount_cents: 0, count: 0 },
  ];
  for (const invoice of erpSalesInvoices) {
    if (invoice.status === "paid" || invoice.status === "draft") {
      continue;
    }
    const overdue = daysOverdue(invoice.due_date);
    const index =
      overdue <= 0 ? 0 : overdue <= 30 ? 1 : overdue <= 60 ? 2 : 3;
    const bucket = buckets[index] as AgingBucket;
    bucket.amount_cents += invoice.total_cents;
    bucket.count += 1;
  }
  return buckets;
})();

export const erpKpi = {
  openPipelineCents: sum(
    erpQuotes
      .filter((quote) => quote.status === "sent" || quote.status === "draft")
      .map((quote) => quote.amount_cents),
  ),
  weightedPipelineCents: Math.round(
    sum(
      erpQuotes
        .filter((quote) => quote.status === "sent" || quote.status === "draft")
        .map((quote) => (quote.amount_cents * quote.probability) / 100),
    ),
  ),
  wonQuarterCents: sum(
    erpQuotes
      .filter((quote) => quote.status === "accepted")
      .map((quote) => quote.amount_cents),
  ),
  ordersBacklogCents: sum(
    erpSalesOrders
      .filter((order) => order.status !== "completed")
      .map((order) => order.amount_cents),
  ),
  receivablesOutstandingCents: sum(
    erpSalesInvoices
      .filter(
        (invoice) => invoice.status !== "paid" && invoice.status !== "draft",
      )
      .map((invoice) => invoice.total_cents),
  ),
  overdueReceivablesCents: sum(
    erpSalesInvoices
      .filter((invoice) => invoice.status === "overdue")
      .map((invoice) => invoice.total_cents),
  ),
  paidYtdCents: sum(
    erpSalesInvoices
      .filter((invoice) => invoice.status === "paid")
      .map((invoice) => invoice.total_cents),
  ),
  payablesOutstandingCents: sum(
    erpPurchaseInvoices
      .filter((invoice) => invoice.status !== "paid")
      .map((invoice) => invoice.total_cents),
  ),
  marketingBudgetCents: sum(erpMarketingCampaigns.map((c) => c.budget_cents)),
  marketingSpendCents: sum(erpMarketingCampaigns.map((c) => c.spend_cents)),
  marketingLeads: sum(erpMarketingCampaigns.map((c) => c.leads)),
  marketingSql: sum(erpMarketingCampaigns.map((c) => c.sql)),
  itAnnualCostCents: sum(erpItAssets.map((a) => a.annual_cost_cents)),
  openTickets: erpItTickets.filter((t) => t.status !== "resolved").length,
};
