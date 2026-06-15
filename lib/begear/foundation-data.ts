import type { ModuleIconKey, ModuleTier, NavigationGroup } from "@/lib/begear/constants";
import type { Tables } from "@/types/database";

const createdAt = "2026-06-14T11:00:00.000Z";
const tenantId = "00000000-0000-4000-8000-000000000001";

function stableId(sequence: number): string {
  return `00000000-0000-4000-8000-${sequence.toString().padStart(12, "0")}`;
}

type BeGearModuleRow = Tables<"modules"> & { icon_key: ModuleIconKey };

type BeGearMetricPoint = {
  label: string;
  value: number;
};

export type BeGearOperationalMetric = {
  label: string;
  value: string;
  detail: string;
  trend: string;
  points: BeGearMetricPoint[];
};

export type BeGearPriorityFlow = {
  label: string;
  title: string;
  detail: string;
  icon: ModuleIconKey;
  href: string;
};

export type BeGearModuleSnapshot = {
  label: string;
  href: string;
  tier: ModuleTier;
  icon: ModuleIconKey;
  description: string;
  metrics: string[];
};

export const p1Tenant = {
  id: tenantId,
  slug: "begear",
  legal_name: "BeGear S.r.l.",
  vat_number: "06709661216",
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
  metadata: {
    experience_years: 20,
    professionals_trained: 2000,
    placement_within_six_months_percent: 97,
    active_s4hana_consultants: 200,
  },
  created_at: createdAt,
  updated_at: createdAt,
} satisfies Tables<"tenants">;

export const p1Company = {
  legalName: p1Tenant.legal_name,
  vatNumber: p1Tenant.vat_number,
  payoff: p1Tenant.payoff,
  claim: p1Tenant.claim,
  phone: p1Tenant.phone,
  email: p1Tenant.email,
  authorization: p1Tenant.authorization,
  certifications: p1Tenant.certifications,
} as const;

export const p1Offices = [
  {
    id: stableId(101),
    tenant_id: tenantId,
    city: "Napoli",
    address: "Centro Direzionale, Isola E7, 80143",
    purpose: "Direzione operativa, Academy e recruiting",
    timezone: "Europe/Rome",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(102),
    tenant_id: tenantId,
    city: "Milano",
    address: "Piazza Gae Aulenti, Torre B, 20154",
    purpose: "Relazioni enterprise, staffing e consulenza",
    timezone: "Europe/Rome",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(103),
    tenant_id: tenantId,
    city: "Lecce",
    address: "Via Colonnello Costadura 2/C, 73100",
    purpose: "Supporto formazione e delivery territoriale",
    timezone: "Europe/Rome",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"offices">[];

export const p1Roles = [
  {
    id: stableId(201),
    tenant_id: tenantId,
    code: "platform_admin",
    name: "Platform Admin",
    description: "Governo tecnico della piattaforma Ecosystem Ω",
    created_at: createdAt,
  },
  {
    id: stableId(202),
    tenant_id: tenantId,
    code: "tenant_admin",
    name: "Tenant Admin",
    description: "Amministrazione BeGear e configurazioni tenant",
    created_at: createdAt,
  },
  {
    id: stableId(203),
    tenant_id: tenantId,
    code: "academy_manager",
    name: "Academy Manager",
    description: "Gestione corsi, edizioni, presenze e assessment",
    created_at: createdAt,
  },
  {
    id: stableId(204),
    tenant_id: tenantId,
    code: "recruiter",
    name: "Recruiter",
    description: "Gestione pipeline ATS, screening e colloqui",
    created_at: createdAt,
  },
  {
    id: stableId(205),
    tenant_id: tenantId,
    code: "placement_manager",
    name: "Placement Manager",
    description: "Coaching alumni, matching partner e outcome placement",
    created_at: createdAt,
  },
  {
    id: stableId(206),
    tenant_id: tenantId,
    code: "staffing_manager",
    name: "Staffing Manager",
    description: "Allocazioni consulenti, progetti ICT e timesheet",
    created_at: createdAt,
  },
  {
    id: stableId(207),
    tenant_id: tenantId,
    code: "sales_manager",
    name: "Sales Manager",
    description: "CRM B2B, offerte e Academy-as-a-Service",
    created_at: createdAt,
  },
  {
    id: stableId(208),
    tenant_id: tenantId,
    code: "compliance_manager",
    name: "Compliance Manager",
    description: "GDPR, audit, policy e autorizzazioni",
    created_at: createdAt,
  },
] satisfies Tables<"roles">[];

export const p1Modules = [
  {
    id: stableId(301),
    module_key: "dashboard",
    label: "Dashboard globale",
    tier: "tier_1",
    route_path: "/#dashboard",
    icon_key: "dashboard",
    is_enabled: true,
    sort_order: 10,
    created_at: createdAt,
  },
  {
    id: stableId(302),
    module_key: "coremind",
    label: "CoreMind Ω",
    tier: "tier_1",
    route_path: "/#coremind",
    icon_key: "ai",
    is_enabled: true,
    sort_order: 20,
    created_at: createdAt,
  },
  {
    id: stableId(303),
    module_key: "betalent",
    label: "BeTalent",
    tier: "tier_1",
    route_path: "/#betalent",
    icon_key: "ats",
    is_enabled: true,
    sort_order: 30,
    created_at: createdAt,
  },
  {
    id: stableId(304),
    module_key: "academy",
    label: "Academy LMS",
    tier: "tier_2",
    route_path: "/#academy",
    icon_key: "academy",
    is_enabled: true,
    sort_order: 40,
    created_at: createdAt,
  },
  {
    id: stableId(305),
    module_key: "ats",
    label: "ATS Recruiting",
    tier: "tier_2",
    route_path: "/#ats",
    icon_key: "ats",
    is_enabled: true,
    sort_order: 50,
    created_at: createdAt,
  },
  {
    id: stableId(306),
    module_key: "placement",
    label: "Placement",
    tier: "tier_2",
    route_path: "/#placement",
    icon_key: "placement",
    is_enabled: true,
    sort_order: 60,
    created_at: createdAt,
  },
  {
    id: stableId(307),
    module_key: "gestionale",
    label: "Gestionale",
    tier: "tier_2",
    route_path: "/#gestionale",
    icon_key: "management",
    is_enabled: true,
    sort_order: 70,
    created_at: createdAt,
  },
  {
    id: stableId(308),
    module_key: "turni",
    label: "Turni e risorse",
    tier: "tier_2",
    route_path: "/#turni",
    icon_key: "shifts",
    is_enabled: true,
    sort_order: 80,
    created_at: createdAt,
  },
  {
    id: stableId(309),
    module_key: "staffing",
    label: "Staffing ICT",
    tier: "tier_3",
    route_path: "/#staffing",
    icon_key: "staffing",
    is_enabled: true,
    sort_order: 90,
    created_at: createdAt,
  },
  {
    id: stableId(310),
    module_key: "crm",
    label: "CRM B2B",
    tier: "tier_3",
    route_path: "/#crm",
    icon_key: "crm",
    is_enabled: true,
    sort_order: 100,
    created_at: createdAt,
  },
  {
    id: stableId(311),
    module_key: "input_hub",
    label: "Input Hub",
    tier: "tier_2",
    route_path: "/#input-hub",
    icon_key: "input",
    is_enabled: true,
    sort_order: 110,
    created_at: createdAt,
  },
  {
    id: stableId(312),
    module_key: "integration_hub",
    label: "Integration Hub",
    tier: "tier_3",
    route_path: "/#integration-hub",
    icon_key: "integrations",
    is_enabled: true,
    sort_order: 120,
    created_at: createdAt,
  },
  {
    id: stableId(313),
    module_key: "documents",
    label: "Documenti",
    tier: "tier_3",
    route_path: "/#documenti",
    icon_key: "documents",
    is_enabled: true,
    sort_order: 130,
    created_at: createdAt,
  },
  {
    id: stableId(314),
    module_key: "compliance",
    label: "GDPR e Compliance",
    tier: "tier_3",
    route_path: "/#compliance",
    icon_key: "compliance",
    is_enabled: true,
    sort_order: 140,
    created_at: createdAt,
  },
] satisfies BeGearModuleRow[];

export const p1AcademyCourses = [
  {
    id: stableId(401),
    tenant_id: tenantId,
    course_code: "SAP-S4-2026",
    title: "Master SAP S/4HANA Consultant",
    domain: "SAP",
    delivery_mode: "Blended Napoli e remoto",
    duration_hours: 240,
    status: "active",
    certification_label: "Partner certificato SAP",
    placement_kpi: "Placement 97% entro 6 mesi",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(402),
    tenant_id: tenantId,
    course_code: "AI-CYB-2026",
    title: "AI e Cybersecurity Specialist",
    domain: "AI e Cybersecurity",
    delivery_mode: "Live remoto con laboratorio",
    duration_hours: 180,
    status: "planned",
    certification_label: "ISO 27001 learning path",
    placement_kpi: "Pipeline partner enterprise",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(403),
    tenant_id: tenantId,
    course_code: "FULLSTACK-2026",
    title: "Full Stack Developer Enterprise",
    domain: "Software Engineering",
    delivery_mode: "Blended Lecce e remoto",
    duration_hours: 220,
    status: "active",
    certification_label: "Portfolio project review",
    placement_kpi: "Inserimento su team ICT",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"academy_courses">[];

export const p1AcademyEditions = [
  {
    id: stableId(501),
    tenant_id: tenantId,
    course_id: stableId(401),
    office_id: stableId(101),
    edition_code: "SAP-S4-NA-Q1",
    title: "Master SAP S/4HANA Napoli Q1",
    start_date: "2026-02-02",
    end_date: "2026-05-29",
    capacity: 28,
    enrolled_count: 24,
    status: "active",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(502),
    tenant_id: tenantId,
    course_id: stableId(402),
    office_id: stableId(102),
    edition_code: "AI-CYB-MI-Q2",
    title: "AI e Cybersecurity Milano Q2",
    start_date: "2026-04-13",
    end_date: "2026-07-31",
    capacity: 24,
    enrolled_count: 18,
    status: "planned",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(503),
    tenant_id: tenantId,
    course_id: stableId(403),
    office_id: stableId(103),
    edition_code: "FULLSTACK-LE-Q1",
    title: "Full Stack Developer Lecce Q1",
    start_date: "2026-01-19",
    end_date: "2026-05-15",
    capacity: 22,
    enrolled_count: 21,
    status: "active",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"academy_editions">[];

export const p1JobOpenings = [
  {
    id: stableId(601),
    tenant_id: tenantId,
    opening_code: "BG-SAP-001",
    title: "SAP FI/CO Junior Consultant",
    business_area: "Staffing SAP",
    location: "Milano ibrido",
    contract_type: "Apprendistato professionalizzante",
    status: "interviewing",
    priority_score: 92,
    required_skills: ["SAP FI", "SAP CO", "Excel", "Inglese B2"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(602),
    tenant_id: tenantId,
    opening_code: "BG-AI-002",
    title: "Cybersecurity Analyst Junior",
    business_area: "Academy Placement",
    location: "Napoli ibrido",
    contract_type: "Tempo determinato ICT",
    status: "screening",
    priority_score: 84,
    required_skills: ["SIEM", "ISO 27001", "Python", "Incident response"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(603),
    tenant_id: tenantId,
    opening_code: "BG-FE-003",
    title: "Full Stack Developer React",
    business_area: "Delivery software",
    location: "Lecce remoto",
    contract_type: "Somministrazione ICT",
    status: "active",
    priority_score: 78,
    required_skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"job_openings">[];

export const p1Candidates = [
  {
    id: stableId(701),
    tenant_id: tenantId,
    profile_code: "CND-SAP-001",
    display_name: "Alumni SAP Finance Track",
    email: "alumni.sap.finance@begear.it",
    headline: "Junior SAP FI/CO con laboratorio S/4HANA completato",
    source: "Academy SAP S/4HANA Napoli",
    status: "placement_ready",
    skills: ["SAP FI", "SAP CO", "S/4HANA", "Business process"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(702),
    tenant_id: tenantId,
    profile_code: "CND-CYB-002",
    display_name: "Alumni Cybersecurity Track",
    email: "alumni.cyber@begear.it",
    headline: "Cybersecurity analyst junior con focus ISO 27001",
    source: "Academy AI e Cybersecurity",
    status: "screening",
    skills: ["SIEM", "ISO 27001", "Python", "Risk assessment"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(703),
    tenant_id: tenantId,
    profile_code: "CND-FS-003",
    display_name: "Alumni Full Stack Track",
    email: "alumni.fullstack@begear.it",
    headline: "Full stack developer junior React e PostgreSQL",
    source: "Academy Full Stack Lecce",
    status: "interviewing",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"candidates">[];

export const p1Placements = [
  {
    id: stableId(801),
    tenant_id: tenantId,
    candidate_id: stableId(701),
    job_opening_id: stableId(601),
    outcome_label: "Partner shortlist completata",
    placed_at: "2026-05-20",
    coaching_notes: "Profilo pronto per colloquio tecnico SAP FI/CO",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(802),
    tenant_id: tenantId,
    candidate_id: stableId(703),
    job_opening_id: stableId(603),
    outcome_label: "Colloquio tecnico pianificato",
    placed_at: null,
    coaching_notes: "Portfolio React validato con feedback senior",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"placements">[];

export const p1BusinessAccounts = [
  {
    id: stableId(901),
    tenant_id: tenantId,
    legal_name: "Enterprise SAP Transformation S.p.A.",
    vat_number: "IT00000000001",
    industry: "Consulenza SAP enterprise",
    account_owner_id: stableId(1007),
    status: "qualified",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(902),
    tenant_id: tenantId,
    legal_name: "Digital Banking Partner S.p.A.",
    vat_number: "IT00000000002",
    industry: "Financial services technology",
    account_owner_id: stableId(1007),
    status: "proposal",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(903),
    tenant_id: tenantId,
    legal_name: "Manufacturing Cloud Group S.r.l.",
    vat_number: "IT00000000003",
    industry: "Industria e cloud operations",
    account_owner_id: stableId(1006),
    status: "active",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"business_accounts">[];

export const p1Projects = [
  {
    id: stableId(1101),
    tenant_id: tenantId,
    account_id: stableId(901),
    project_code: "PRJ-SAP-AMS-2026",
    name: "S/4HANA AMS Finance Factory",
    service_line: "SAP consulting",
    start_date: "2026-01-15",
    end_date: "2026-12-31",
    status: "active",
    budget_cents: 42000000,
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1102),
    tenant_id: tenantId,
    account_id: stableId(902),
    project_code: "PRJ-CYB-GRC-2026",
    name: "GRC e Cybersecurity Enablement",
    service_line: "Cybersecurity academy placement",
    start_date: "2026-04-01",
    end_date: null,
    status: "planned",
    budget_cents: 18000000,
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1103),
    tenant_id: tenantId,
    account_id: stableId(903),
    project_code: "PRJ-FS-PLATFORM-2026",
    name: "Cloud operations workforce pod",
    service_line: "Staffing ICT",
    start_date: "2026-02-01",
    end_date: "2026-09-30",
    status: "active",
    budget_cents: 26000000,
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"projects">[];

export const p1Consultants = [
  {
    id: stableId(1201),
    tenant_id: tenantId,
    user_id: null,
    profile_code: "CONS-SAP-001",
    display_name: "Consulente SAP S/4HANA Senior",
    seniority: "Senior",
    primary_skill: "SAP S/4HANA Finance",
    availability_status: "allocated",
    daily_rate_cents: 72000,
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1202),
    tenant_id: tenantId,
    user_id: null,
    profile_code: "CONS-CYB-002",
    display_name: "Cybersecurity Consultant ISO 27001",
    seniority: "Middle",
    primary_skill: "ISO 27001 e risk management",
    availability_status: "available",
    daily_rate_cents: 56000,
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1203),
    tenant_id: tenantId,
    user_id: null,
    profile_code: "CONS-FS-003",
    display_name: "Full Stack Consultant TypeScript",
    seniority: "Middle",
    primary_skill: "React e Node.js",
    availability_status: "allocated",
    daily_rate_cents: 52000,
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"consultants">[];

export const p1Allocations = [
  {
    id: stableId(1301),
    tenant_id: tenantId,
    project_id: stableId(1101),
    consultant_id: stableId(1201),
    status: "active",
    start_date: "2026-01-15",
    end_date: "2026-12-31",
    allocation_percentage: 80,
    billable: true,
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1302),
    tenant_id: tenantId,
    project_id: stableId(1103),
    consultant_id: stableId(1203),
    status: "active",
    start_date: "2026-02-01",
    end_date: "2026-09-30",
    allocation_percentage: 100,
    billable: true,
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1303),
    tenant_id: tenantId,
    project_id: stableId(1102),
    consultant_id: stableId(1202),
    status: "proposed",
    start_date: "2026-04-01",
    end_date: null,
    allocation_percentage: 60,
    billable: true,
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"consultant_allocations">[];

export const p1Timesheets = [
  {
    id: stableId(1401),
    tenant_id: tenantId,
    consultant_id: stableId(1201),
    project_id: stableId(1101),
    work_date: "2026-06-08",
    hours: 7.5,
    activity: "Blueprint finance e supporto AMS",
    status: "approved",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1402),
    tenant_id: tenantId,
    consultant_id: stableId(1203),
    project_id: stableId(1103),
    work_date: "2026-06-08",
    hours: 8,
    activity: "Sviluppo componenti React e API Node.js",
    status: "submitted",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1403),
    tenant_id: tenantId,
    consultant_id: stableId(1202),
    project_id: stableId(1102),
    work_date: "2026-06-08",
    hours: 4,
    activity: "Assessment ISO 27001 e piano controlli",
    status: "draft",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"timesheets">[];

export const p1ResourceShifts = [
  {
    id: stableId(1501),
    tenant_id: tenantId,
    office_id: stableId(101),
    assigned_user_id: stableId(1002),
    starts_at: "2026-06-15T07:00:00.000Z",
    ends_at: "2026-06-15T11:00:00.000Z",
    status: "confirmed",
    activity: "Aula SAP S/4HANA e assessment pratico",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1502),
    tenant_id: tenantId,
    office_id: stableId(102),
    assigned_user_id: stableId(1006),
    starts_at: "2026-06-15T12:00:00.000Z",
    ends_at: "2026-06-15T16:00:00.000Z",
    status: "assigned",
    activity: "Staffing review con partner enterprise",
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: stableId(1503),
    tenant_id: tenantId,
    office_id: stableId(103),
    assigned_user_id: stableId(1008),
    starts_at: "2026-06-16T08:00:00.000Z",
    ends_at: "2026-06-16T10:00:00.000Z",
    status: "planned",
    activity: "Verifica documentale GDPR e policy Academy",
    created_at: createdAt,
    updated_at: createdAt,
  },
] satisfies Tables<"resource_shifts">[];

export const p1AuditEvents = [
  {
    id: stableId(1601),
    tenant_id: tenantId,
    actor_user_id: stableId(1001),
    event_type: "seed.p1.loaded",
    entity_table: "tenants",
    entity_id: tenantId,
    payload: {
      source: "supabase seed",
      scope: "P1 database foundation",
    },
    created_at: createdAt,
  },
] satisfies Tables<"audit_events">[];

const tierLabels = {
  tier_1: "TIER 1",
  tier_2: "TIER 2",
  tier_3: "TIER 3",
} satisfies Record<Tables<"modules">["tier"], ModuleTier>;

function moduleToNavigationItem(module: BeGearModuleRow) {
  return {
    label: module.label,
    href: module.route_path,
    tier: tierLabels[module.tier],
    icon: module.icon_key,
  };
}

function findModule(moduleKey: string): BeGearModuleRow {
  const appModule = p1Modules.find((item) => item.module_key === moduleKey);

  if (!appModule) {
    throw new Error(`Modulo P1 non configurato: ${moduleKey}`);
  }

  return appModule;
}

export const p1NavigationGroups: NavigationGroup[] = [
  {
    label: "Intelligenza operativa",
    items: ["dashboard", "coremind", "betalent"].map((moduleKey) =>
      moduleToNavigationItem(findModule(moduleKey)),
    ),
  },
  {
    label: "Filiera BeGear",
    items: ["academy", "ats", "placement", "gestionale", "turni"].map((moduleKey) =>
      moduleToNavigationItem(findModule(moduleKey)),
    ),
  },
  {
    label: "Piattaforma estesa",
    items: [
      "staffing",
      "crm",
      "input_hub",
      "integration_hub",
      "documents",
      "compliance",
    ].map((moduleKey) => moduleToNavigationItem(findModule(moduleKey))),
  },
];

const totalEnrolled = p1AcademyEditions.reduce(
  (total, edition) => total + edition.enrolled_count,
  0,
);
const totalCapacity = p1AcademyEditions.reduce(
  (total, edition) => total + edition.capacity,
  0,
);
const activeAllocations = p1Allocations.filter(
  (allocation) => allocation.status === "active",
).length;
const totalTimesheetHours = p1Timesheets.reduce(
  (total, timesheet) => total + timesheet.hours,
  0,
);
const averagePriority = Math.round(
  p1JobOpenings.reduce((total, opening) => total + opening.priority_score, 0) /
    p1JobOpenings.length,
);

export const p1OperationalMetrics: BeGearOperationalMetric[] = [
  {
    label: "Edizioni Academy",
    value: p1AcademyEditions.length.toString(),
    detail: `${totalEnrolled} iscritti su ${totalCapacity} posti tra SAP, AI/Cybersecurity e Full Stack`,
    trend: "2 edizioni attive e 1 pianificata",
    points: [
      { label: "Gen", value: 21 },
      { label: "Feb", value: 24 },
      { label: "Mar", value: 42 },
      { label: "Apr", value: 50 },
      { label: "Mag", value: 57 },
      { label: "Giu", value: totalEnrolled },
    ],
  },
  {
    label: "Pipeline ATS",
    value: p1JobOpenings.length.toString(),
    detail: `${p1Candidates.length} profili alumni collegati a posizioni con priorità media ${averagePriority}`,
    trend: "BG-SAP-001 guida la priorità con score 92",
    points: [
      { label: "Gen", value: 1 },
      { label: "Feb", value: 1 },
      { label: "Mar", value: 2 },
      { label: "Apr", value: 2 },
      { label: "Mag", value: 3 },
      { label: "Giu", value: p1JobOpenings.length },
    ],
  },
  {
    label: "Placement tracciati",
    value: p1Placements.length.toString(),
    detail: "Shortlist SAP completata e colloquio tecnico Full Stack pianificato",
    trend: "1 outcome già datato nel seed P1",
    points: [
      { label: "Gen", value: 0 },
      { label: "Feb", value: 0 },
      { label: "Mar", value: 1 },
      { label: "Apr", value: 1 },
      { label: "Mag", value: 2 },
      { label: "Giu", value: p1Placements.length },
    ],
  },
  {
    label: "Consulenti allocati",
    value: `${activeAllocations}/${p1Consultants.length}`,
    detail: `${totalTimesheetHours.toLocaleString("it-IT")} ore consuntivate tra SAP, Full Stack e Cybersecurity`,
    trend: "2 allocazioni billable attive",
    points: [
      { label: "Gen", value: 1 },
      { label: "Feb", value: 2 },
      { label: "Mar", value: 2 },
      { label: "Apr", value: 2 },
      { label: "Mag", value: 2 },
      { label: "Giu", value: activeAllocations },
    ],
  },
];

export const p1FlowSteps = [
  "Lead Input Hub qualificato su Master SAP",
  "Academy Advisor assegna edizione SAP-S4-NA-Q1",
  "Alumnus completa laboratorio S/4HANA",
  "ATS apre BG-SAP-001 con priorità 92",
  "Placement Coach chiude shortlist partner",
  "Staffing aggancia progetto PRJ-SAP-AMS-2026",
] as const;

export const p1PriorityFlows: BeGearPriorityFlow[] = [
  {
    label: "Flusso A",
    title: "Academy operativa",
    detail: "3 corsi P1, 3 edizioni e 63 iscritti alimentano la pipeline talenti BeGear.",
    icon: "academy",
    href: "/#academy",
  },
  {
    label: "Flusso B",
    title: "ATS + BeTalent",
    detail:
      "3 posizioni reali e 3 profili alumni sostengono matching e screening motivato.",
    icon: "ats",
    href: "/#ats",
  },
  {
    label: "Flusso C",
    title: "Placement misurabile",
    detail: "2 outcome tracciati collegano candidati, posizioni e note di coaching.",
    icon: "placement",
    href: "/#placement",
  },
  {
    label: "Flusso D",
    title: "Staffing ICT",
    detail:
      "3 progetti, 3 consulenti, 3 allocazioni e timesheet billable alimentano il gestionale.",
    icon: "staffing",
    href: "/#staffing",
  },
  {
    label: "Flusso E",
    title: "Governance e audit",
    detail:
      "RBAC, RLS, turni e audit events rendono il tenant pronto per processi controllati.",
    icon: "compliance",
    href: "/#compliance",
  },
];

export const p1PlatformReadiness = [
  "Migrazione P1 con 18 tabelle tenant-aware e indici operativi",
  "RLS attiva con policy per tenant, Academy, recruiting, placement, staffing e compliance",
  "Seed BeGear con tenant, sedi, RBAC, moduli e dati operativi della filiera",
  "Tipi Supabase manuali strict e query layer loadTenantFoundation/loadOperationalOverview",
  "Build Next.js stabile su Windows tramite wrapper readlink shim",
] as const;

export const p1ModuleSnapshots: BeGearModuleSnapshot[] = [
  {
    label: "Academy LMS",
    href: "/#academy",
    tier: "TIER 2",
    icon: "academy",
    description:
      "Corsi SAP, AI/Cybersecurity e Full Stack con edizioni, capienza e iscritti.",
    metrics: [
      `${p1AcademyCourses.length} corsi`,
      `${totalEnrolled} iscritti`,
      "740 ore totali",
    ],
  },
  {
    label: "ATS Recruiting",
    href: "/#ats",
    tier: "TIER 2",
    icon: "ats",
    description:
      "Pipeline posizioni con priorità, skill richieste e stato di avanzamento.",
    metrics: [
      `${p1JobOpenings.length} posizioni`,
      `${averagePriority} priorità media`,
      "12 skill indicizzate",
    ],
  },
  {
    label: "Placement",
    href: "/#placement",
    tier: "TIER 2",
    icon: "placement",
    description:
      "Outcome collegati a candidati, opening e note coaching per partner enterprise.",
    metrics: [`${p1Placements.length} outcome`, "1 placement datato", "2 note coaching"],
  },
  {
    label: "Gestionale",
    href: "/#gestionale",
    tier: "TIER 2",
    icon: "management",
    description:
      "Account, progetti, consulenti, allocazioni e timesheet in un unico modello.",
    metrics: [
      `${p1Projects.length} progetti`,
      `${activeAllocations} allocazioni attive`,
      `${totalTimesheetHours.toLocaleString("it-IT")} ore`,
    ],
  },
  {
    label: "Turni e risorse",
    href: "/#turni",
    tier: "TIER 2",
    icon: "shifts",
    description:
      "Presidio sedi Napoli, Milano e Lecce con attività operative calendarizzate.",
    metrics: [`${p1ResourceShifts.length} turni`, "3 sedi", "2 confermati/assegnati"],
  },
  {
    label: "CRM B2B",
    href: "/#crm",
    tier: "TIER 3",
    icon: "crm",
    description:
      "Account enterprise collegati a owner, status commerciale e progetti attivi.",
    metrics: [`${p1BusinessAccounts.length} account`, "1 proposta", "1 account attivo"],
  },
  {
    label: "Staffing ICT",
    href: "/#staffing",
    tier: "TIER 3",
    icon: "staffing",
    description:
      "Consulenti SAP, Cybersecurity e Full Stack con disponibilità e daily rate.",
    metrics: [`${p1Consultants.length} consulenti`, "2 allocati", "1 disponibile"],
  },
  {
    label: "GDPR e Compliance",
    href: "/#compliance",
    tier: "TIER 3",
    icon: "compliance",
    description:
      "Ruoli compliance, audit event e policy RLS applicate a ogni tabella tenant.",
    metrics: [
      `${p1Roles.length} ruoli`,
      `${p1AuditEvents.length} audit event`,
      "RLS tenant-aware",
    ],
  },
];

export const p1CoreMindAnswers = [
  `P1 è operativo: ${p1Modules.length} moduli, ${p1Roles.length} ruoli RBAC e ${p1Offices.length} sedi BeGear sono allineati al seed Supabase.`,
  `La filiera contiene ${p1AcademyCourses.length} corsi, ${p1JobOpenings.length} posizioni ATS, ${p1Placements.length} outcome placement e ${p1Projects.length} progetti enterprise.`,
  `Il gestionale P1 traccia ${p1Consultants.length} consulenti, ${p1Allocations.length} allocazioni e ${totalTimesheetHours.toLocaleString("it-IT")} ore consuntivate nel seed operativo.`,
] as const;
