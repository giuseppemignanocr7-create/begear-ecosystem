export type IntegrationKey = "email" | "calendar" | "website_form" | "sap_sandbox";

export interface IntegrationDefinition {
  key: IntegrationKey;
  label: string;
  purpose: string;
}

export const integrationDefinitions: IntegrationDefinition[] = [
  {
    key: "email",
    label: "Email candidature",
    purpose: "Ingestione candidature e comunicazioni operative",
  },
  {
    key: "calendar",
    label: "Calendario lezioni e colloqui",
    purpose: "Sincronizzazione agenda per academy, recruiter e aziende partner",
  },
  {
    key: "website_form",
    label: "Form sito BeGear",
    purpose: "Acquisizione lead B2C, B2B e candidature dal sito",
  },
  {
    key: "sap_sandbox",
    label: "Sandbox SAP S/4HANA",
    purpose: "Tracking account studenti dal primo giorno di corso",
  },
];
