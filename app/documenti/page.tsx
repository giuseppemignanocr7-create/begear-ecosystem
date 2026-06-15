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
import {
  p1AcademyEditions,
  p1Candidates,
  p1Projects,
  p1Roles,
} from "@/lib/begear/foundation-data";
import { formatDate } from "@/lib/begear/format";

const ACCENT = "#475569";

const attestati = p1AcademyEditions.reduce(
  (total, edition) => total + edition.enrolled_count,
  0,
);

interface DocCategory {
  title: string;
  description: string;
  count: number;
  format: string;
}

const categories: DocCategory[] = [
  {
    title: "Contratti",
    description: "Contratti di servizio e somministrazione collegati ai progetti.",
    count: p1Projects.length,
    format: "PDF firmato",
  },
  {
    title: "Attestati Academy",
    description: "Certificati e attestati rilasciati agli iscritti delle edizioni.",
    count: attestati,
    format: "PDF",
  },
  {
    title: "CV candidati",
    description: "Curriculum dei profili alumni gestiti nella pipeline ATS.",
    count: p1Candidates.length,
    format: "PDF / DOCX",
  },
  {
    title: "Policy e GDPR",
    description: "Documenti di governance, consensi e policy per ruolo.",
    count: p1Roles.length,
    format: "PDF",
  },
];

type DocStatus = "signed" | "review" | "draft";

const docStatusLabel: Record<DocStatus, string> = {
  signed: "Firmato",
  review: "In revisione",
  draft: "Bozza",
};

const docStatusTone: Record<DocStatus, StatusTone> = {
  signed: "green",
  review: "amber",
  draft: "gray",
};

interface DocItem {
  name: string;
  category: string;
  owner: string;
  date: string;
  status: DocStatus;
}

const recentDocs: DocItem[] = [
  {
    name: "Contratto AMS - Enterprise SAP",
    category: "Contratti",
    owner: "M. De Santis",
    date: "2026-06-10",
    status: "signed",
  },
  {
    name: "Contratto Cloud Ops Pod - Manufacturing",
    category: "Contratti",
    owner: "L. Ferraro",
    date: "2026-06-12",
    status: "draft",
  },
  {
    name: "Attestato SAP S/4HANA - Edizione NA-Q1",
    category: "Attestati Academy",
    owner: "G. Russo",
    date: "2026-06-08",
    status: "signed",
  },
  {
    name: "Policy GDPR aggiornata v3",
    category: "Policy e GDPR",
    owner: "Compliance",
    date: "2026-06-05",
    status: "review",
  },
  {
    name: "CV Alumni Full Stack - shortlist",
    category: "CV candidati",
    owner: "R. Esposito",
    date: "2026-06-11",
    status: "signed",
  },
];

export default function DocumentiPage() {
  const total = categories.reduce((sum, category) => sum + category.count, 0);
  const signed = recentDocs.filter((doc) => doc.status === "signed").length;

  const categoryColumns: Column<DocCategory>[] = [
    {
      key: "title",
      header: "Categoria",
      render: (category) => (
        <div>
          <p className="font-medium">{category.title}</p>
          <p className="text-xs text-muted-foreground">{category.description}</p>
        </div>
      ),
    },
    { key: "format", header: "Formato", render: (category) => category.format },
    {
      key: "count",
      header: "Documenti",
      align: "right",
      render: (category) => (
        <span className="font-medium tabular-nums">{category.count}</span>
      ),
    },
  ];

  const docColumns: Column<DocItem>[] = [
    {
      key: "name",
      header: "Documento",
      render: (doc) => <span className="font-medium">{doc.name}</span>,
    },
    { key: "category", header: "Categoria", render: (doc) => doc.category },
    { key: "owner", header: "Owner", render: (doc) => doc.owner },
    { key: "date", header: "Data", render: (doc) => formatDate(doc.date) },
    {
      key: "status",
      header: "Stato",
      render: (doc) => (
        <StatusBadge tone={docStatusTone[doc.status]}>
          {docStatusLabel[doc.status]}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="documenti"
        stats={[
          { label: "Categorie", value: String(categories.length) },
          { label: "Documenti", value: String(total) },
          { label: "Recenti", value: String(recentDocs.length) },
          { label: "Firmati", value: String(signed) },
        ]}
      />

      <Section
        id="categorie"
        title="Categorie documentali"
        description="Archivio della filiera BeGear per tipologia e formato."
      >
        <MetricGrid>
          {categories.map((category) => (
            <MetricTile
              key={category.title}
              label={category.title}
              value={String(category.count)}
              hint={category.format}
              accent={ACCENT}
            />
          ))}
        </MetricGrid>
        <DataTable
          caption="Categorie documentali"
          columns={categoryColumns}
          rows={categories}
          getRowKey={(category) => category.title}
        />
      </Section>

      <Section
        id="recenti"
        title="Documenti recenti"
        description="Ultimi documenti caricati o aggiornati con stato di firma."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Documenti recenti"
          columns={docColumns}
          rows={recentDocs}
          getRowKey={(doc) => doc.name}
        />
      </Section>
    </div>
  );
}
