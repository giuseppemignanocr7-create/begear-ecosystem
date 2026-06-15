export type ModuleTier = "TIER 1" | "TIER 2" | "TIER 3";

export type ModuleIconKey =
  | "dashboard"
  | "academy"
  | "ats"
  | "placement"
  | "management"
  | "shifts"
  | "staffing"
  | "crm"
  | "input"
  | "integrations"
  | "documents"
  | "compliance"
  | "ai";

export interface NavigationItem {
  label: string;
  href: string;
  tier: ModuleTier;
  icon: ModuleIconKey;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface BeGearMetric {
  label: string;
  value: string;
  detail: string;
  trend: string;
}

export interface BeGearOffice {
  city: string;
  address: string;
  purpose: string;
}

export const begearCompany = {
  legalName: "BeGear S.r.l.",
  vatNumber: "06709661216",
  payoff: "Developing Digital Talents",
  claim: "L'ingranaggio che trasforma il tuo business",
  phone: "02 829 406 75",
  email: "ufficiomarketing@begear.it",
  authorization:
    "Agenzia per il Lavoro autorizzata Min. dal 15/11/2018, Albo Informatico sezioni 4 e 5",
  certifications: [
    "ISO 27001",
    "ISO 9001:2015 Istituto Giordano",
    "Accredia",
    "Partner certificato SAP",
  ],
} as const;

export const begearMetrics: BeGearMetric[] = [
  {
    label: "Anni di esperienza",
    value: "20+",
    detail: "Formazione, selezione e consulenza ICT per imprese enterprise",
    trend: "Storico consolidato",
  },
  {
    label: "Professionisti formati",
    value: "2.000+",
    detail: "Percorsi SAP, AI, Cybersecurity e sviluppo digitale",
    trend: "Academy attiva",
  },
  {
    label: "Placement entro 6 mesi",
    value: "97%",
    detail: "Alumni accompagnati verso aziende partner e progetti ICT",
    trend: "KPI strategico",
  },
  {
    label: "Consulenti S/4HANA attivi",
    value: "200+",
    detail: "Competenze SAP inserite in programmi di trasformazione digitale",
    trend: "Delivery enterprise",
  },
];

export const begearOffices: BeGearOffice[] = [
  {
    city: "Napoli",
    address: "Centro Direzionale, Isola E7, 80143",
    purpose: "Direzione operativa, Academy e recruiting",
  },
  {
    city: "Milano",
    address: "Piazza Gae Aulenti, Torre B, 20154",
    purpose: "Relazioni enterprise, staffing e consulenza",
  },
  {
    city: "Lecce",
    address: "Via Colonnello Costadura 2/C, 73100",
    purpose: "Supporto formazione e delivery territoriale",
  },
];

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Intelligenza operativa",
    items: [
      {
        label: "Dashboard globale",
        href: "/#dashboard",
        tier: "TIER 1",
        icon: "dashboard",
      },
      { label: "CoreMind Ω", href: "/#coremind", tier: "TIER 1", icon: "ai" },
      { label: "BeTalent", href: "/#betalent", tier: "TIER 1", icon: "ats" },
    ],
  },
  {
    label: "Filiera BeGear",
    items: [
      { label: "Academy LMS", href: "/#academy", tier: "TIER 2", icon: "academy" },
      { label: "ATS Recruiting", href: "/#ats", tier: "TIER 2", icon: "ats" },
      { label: "Placement", href: "/#placement", tier: "TIER 2", icon: "placement" },
      { label: "Gestionale", href: "/#gestionale", tier: "TIER 2", icon: "management" },
      { label: "Turni e risorse", href: "/#turni", tier: "TIER 2", icon: "shifts" },
    ],
  },
  {
    label: "Piattaforma estesa",
    items: [
      { label: "Staffing ICT", href: "/#staffing", tier: "TIER 3", icon: "staffing" },
      { label: "CRM B2B", href: "/#crm", tier: "TIER 3", icon: "crm" },
      { label: "Input Hub", href: "/#input-hub", tier: "TIER 2", icon: "input" },
      {
        label: "Integration Hub",
        href: "/#integration-hub",
        tier: "TIER 3",
        icon: "integrations",
      },
      { label: "Documenti", href: "/#documenti", tier: "TIER 3", icon: "documents" },
      {
        label: "GDPR e Compliance",
        href: "/#compliance",
        tier: "TIER 3",
        icon: "compliance",
      },
    ],
  },
];

export const flowSteps = [
  "Lead da Input Hub",
  "Academy Advisor su Master SAP",
  "Iscrizione edizione",
  "Sandbox SAP dal giorno 1",
  "Assessment e attestato",
  "Placement verso partner",
] as const;
