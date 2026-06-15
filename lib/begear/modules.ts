import type { ModuleIconKey } from "@/lib/begear/constants";

export type ModuleKey =
  | "dashboard"
  | "coremind"
  | "betalent"
  | "academy"
  | "ats"
  | "placement"
  | "gestionale"
  | "turni"
  | "staffing"
  | "crm"
  | "input-hub"
  | "integration-hub"
  | "documenti"
  | "compliance";

export interface ModuleDefinition {
  key: ModuleKey;
  label: string;
  path: string;
  icon: ModuleIconKey;
  accent: string;
  tagline: string;
  description: string;
}

export interface ModuleGroup {
  label: string;
  modules: ModuleDefinition[];
}

export const modules: ModuleDefinition[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: "dashboard",
    accent: "#2563eb",
    tagline: "Panoramica operativa",
    description:
      "Indicatori chiave, stato della filiera e accesso rapido a tutti i moduli BeGear.",
  },
  {
    key: "coremind",
    label: "CoreMind",
    path: "/coremind",
    icon: "ai",
    accent: "#7c3aed",
    tagline: "Assistente AI trasversale",
    description:
      "Agente AI che legge i dati della piattaforma e supporta ogni area operativa.",
  },
  {
    key: "betalent",
    label: "BeTalent",
    path: "/betalent",
    icon: "ats",
    accent: "#4f46e5",
    tagline: "Matching e screening",
    description:
      "Scoring motivato tra profili alumni e posizioni aperte, con screening dei CV.",
  },
  {
    key: "academy",
    label: "Academy",
    path: "/academy",
    icon: "academy",
    accent: "#059669",
    tagline: "Formazione certificata",
    description:
      "Corsi, edizioni, capienza e iscritti dei percorsi SAP, AI/Cybersecurity e Full Stack.",
  },
  {
    key: "ats",
    label: "ATS Recruiting",
    path: "/ats",
    icon: "ats",
    accent: "#0284c7",
    tagline: "Pipeline selezione",
    description:
      "Posizioni aperte, competenze richieste, priorità e profili candidati collegati.",
  },
  {
    key: "placement",
    label: "Placement",
    path: "/placement",
    icon: "placement",
    accent: "#d97706",
    tagline: "Inserimento alumni",
    description:
      "Outcome di inserimento tra candidati formati, posizioni e note di coaching.",
  },
  {
    key: "gestionale",
    label: "Gestionale",
    path: "/gestionale",
    icon: "management",
    accent: "#0891b2",
    tagline: "Progetti e budget",
    description:
      "ERP della filiera: vendite, ordini, fatturazione attiva e passiva, scadenzario, commesse, marketing e IT.",
  },
  {
    key: "turni",
    label: "Turni e risorse",
    path: "/turni",
    icon: "shifts",
    accent: "#0d9488",
    tagline: "Presidio sedi",
    description:
      "Turni e attività operative pianificate sulle sedi di Napoli, Milano e Lecce.",
  },
  {
    key: "staffing",
    label: "Staffing ICT",
    path: "/staffing",
    icon: "staffing",
    accent: "#ea580c",
    tagline: "Consulenti e allocazioni",
    description:
      "Consulenti, disponibilità, allocazioni sui progetti e ore consuntivate a timesheet.",
  },
  {
    key: "crm",
    label: "CRM B2B",
    path: "/crm",
    icon: "crm",
    accent: "#db2777",
    tagline: "Account enterprise",
    description:
      "Account commerciali, owner, stato della trattativa e progetti collegati.",
  },
  {
    key: "input-hub",
    label: "Input Hub",
    path: "/input-hub",
    icon: "input",
    accent: "#c026d3",
    tagline: "Acquisizione lead",
    description:
      "Punto unico di ingresso per lead, candidature e richieste verso la filiera.",
  },
  {
    key: "integration-hub",
    label: "Integration Hub",
    path: "/integration-hub",
    icon: "integrations",
    accent: "#9333ea",
    tagline: "Connettori e API",
    description:
      "Integrazioni con sistemi esterni, sincronizzazioni e flussi dati governati.",
  },
  {
    key: "documenti",
    label: "Documenti",
    path: "/documenti",
    icon: "documents",
    accent: "#475569",
    tagline: "Archivio e contratti",
    description:
      "Repository documentale per contratti, attestati e materiali della filiera.",
  },
  {
    key: "compliance",
    label: "GDPR e Compliance",
    path: "/compliance",
    icon: "compliance",
    accent: "#dc2626",
    tagline: "Governance e audit",
    description: "Ruoli RBAC, policy RLS, audit event e stato di conformità del tenant.",
  },
];

export const moduleGroups: ModuleGroup[] = [
  {
    label: "Panoramica",
    modules: filterModules(["dashboard"]),
  },
  {
    label: "Filiera",
    modules: filterModules([
      "academy",
      "ats",
      "placement",
      "staffing",
      "crm",
      "gestionale",
      "turni",
    ]),
  },
  {
    label: "Piattaforma & AI",
    modules: filterModules([
      "coremind",
      "betalent",
      "input-hub",
      "integration-hub",
      "documenti",
      "compliance",
    ]),
  },
];

function filterModules(keys: ModuleKey[]): ModuleDefinition[] {
  return keys.map((key) => {
    const found = modules.find((module) => module.key === key);
    if (!found) {
      throw new Error(`Modulo non definito: ${key}`);
    }
    return found;
  });
}

export function getModuleByKey(key: ModuleKey): ModuleDefinition {
  return filterModules([key])[0] as ModuleDefinition;
}

export function getModuleByPath(pathname: string): ModuleDefinition | undefined {
  if (pathname === "/") {
    return getModuleByKey("dashboard");
  }
  return modules.find(
    (module) => module.path !== "/" && pathname.startsWith(module.path),
  );
}

export function accentSoft(accent: string): string {
  return `${accent}14`;
}

export function accentSoftStrong(accent: string): string {
  return `${accent}24`;
}

export function accentBorder(accent: string): string {
  return `${accent}33`;
}
