import { Bot, Database, ShieldCheck, Workflow } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataTable,
  ModuleHeader,
  Section,
  StatusBadge,
  type Column,
} from "@/components/core/module-page";
import { p1CoreMindAnswers } from "@/lib/begear/foundation-data";

const ACCENT = "#7c3aed";

const capabilities = [
  {
    icon: Database,
    title: "RAG sui dati BeGear",
    description: "Risponde leggendo Academy, ATS, placement, staffing e CRM del tenant.",
  },
  {
    icon: Workflow,
    title: "Tool-use governato",
    description: "Azioni whitelisted e validate prima di toccare i dati operativi.",
  },
  {
    icon: ShieldCheck,
    title: "RBAC e audit",
    description: "Ogni interazione rispetta ruoli, RLS e tracciamento audit.",
  },
];

interface Agent {
  name: string;
  area: string;
  description: string;
  active: boolean;
}

const agents: Agent[] = [
  {
    name: "BeTalent Match",
    area: "Recruiting",
    description: "Scoring motivato candidato ↔ posizione.",
    active: true,
  },
  {
    name: "CV Screening",
    area: "ATS",
    description: "Estrazione competenze e ranking dei CV.",
    active: true,
  },
  {
    name: "Academy Advisor",
    area: "Academy",
    description: "Orientamento sui percorsi e prerequisiti.",
    active: true,
  },
  {
    name: "Placement Coach",
    area: "Placement",
    description: "Preparazione colloqui e feedback agli alumni.",
    active: true,
  },
  {
    name: "Sales Copilot",
    area: "CRM",
    description: "Sintesi account e next best action commerciale.",
    active: false,
  },
  {
    name: "Compliance Sentinel",
    area: "Compliance",
    description: "Controllo policy, consensi e anomalie.",
    active: false,
  },
  {
    name: "Insight Generator",
    area: "Dashboard",
    description: "KPI narrativi e trend operativi della filiera.",
    active: true,
  },
];

export default function CoreMindPage() {
  const activeAgents = agents.filter((agent) => agent.active).length;

  const agentColumns: Column<Agent>[] = [
    {
      key: "name",
      header: "Agente",
      render: (agent) => <span className="font-medium">{agent.name}</span>,
    },
    { key: "area", header: "Area", render: (agent) => agent.area },
    {
      key: "description",
      header: "Funzione",
      render: (agent) => (
        <span className="text-sm text-muted-foreground">{agent.description}</span>
      ),
    },
    {
      key: "status",
      header: "Stato",
      render: (agent) => (
        <StatusBadge tone={agent.active ? "green" : "amber"}>
          {agent.active ? "Attivo" : "Beta"}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="coremind"
        stats={[
          { label: "Agenti", value: String(agents.length), hint: "verticali" },
          { label: "Attivi", value: String(activeAgents) },
          { label: "Aree coperte", value: "Tutte" },
          { label: "Sorgente", value: "Dati P1" },
        ]}
      />

      <Section
        id="capacita"
        title="Cosa sa fare"
        description="Capacità principali dell'assistente trasversale CoreMind."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <Card key={capability.title}>
                <CardHeader>
                  <span
                    className="grid size-10 place-items-center rounded-xl"
                    style={{ backgroundColor: `${ACCENT}1f`, color: ACCENT }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-base">{capability.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section
        id="agenti"
        title="Agenti verticali"
        description="Sette agenti specializzati per le diverse aree della piattaforma."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Agenti verticali"
          columns={agentColumns}
          rows={agents}
          getRowKey={(agent) => agent.name}
        />
      </Section>

      <Section
        id="esempi"
        title="Esempi di risposta"
        description="Output sintetici generati sui dati della piattaforma."
        collapsible
        defaultOpen={false}
      >
        <div className="space-y-3">
          {p1CoreMindAnswers.map((answer) => (
            <div
              key={answer}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <span
                className="grid size-8 shrink-0 place-items-center rounded-lg text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <p className="text-sm leading-6">{answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
