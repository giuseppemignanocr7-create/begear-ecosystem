import {
  DataTable,
  ModuleHeader,
  ProgressBar,
  Section,
  StatusBadge,
  type Column,
  type StatusTone,
} from "@/components/core/module-page";
import { p1Candidates, p1JobOpenings } from "@/lib/begear/foundation-data";

const ACCENT = "#4f46e5";

interface MatchResult {
  candidateName: string;
  openingTitle: string;
  openingCode: string;
  shared: string[];
  score: number;
}

function buildMatches(): MatchResult[] {
  return p1Candidates.map((candidate) => {
    const candidateSkills = new Set(candidate.skills);
    let best = p1JobOpenings[0];
    let bestShared: string[] = [];

    for (const opening of p1JobOpenings) {
      const shared = opening.required_skills.filter((skill) =>
        candidateSkills.has(skill),
      );
      if (shared.length > bestShared.length) {
        best = opening;
        bestShared = shared;
      }
    }

    const opening = best ?? p1JobOpenings[0];
    const required = opening ? opening.required_skills.length : 1;
    const score = Math.round((bestShared.length / Math.max(required, 1)) * 100);

    return {
      candidateName: candidate.display_name,
      openingTitle: opening ? opening.title : "—",
      openingCode: opening ? opening.opening_code : "—",
      shared: bestShared,
      score,
    };
  });
}

interface SkillRow {
  skill: string;
  demand: number;
  supply: number;
}

function buildSkillCoverage(): SkillRow[] {
  const required = new Set<string>();
  for (const opening of p1JobOpenings) {
    for (const skill of opening.required_skills) {
      required.add(skill);
    }
  }
  return [...required]
    .map((skill) => ({
      skill,
      demand: p1JobOpenings.filter((opening) =>
        opening.required_skills.includes(skill),
      ).length,
      supply: p1Candidates.filter((candidate) =>
        candidate.skills.includes(skill),
      ).length,
    }))
    .sort((a, b) => b.demand - a.demand || b.supply - a.supply);
}

function recommendation(score: number): { label: string; tone: StatusTone } {
  if (score >= 66) return { label: "Match forte", tone: "green" };
  if (score >= 34) return { label: "Match medio", tone: "amber" };
  return { label: "Match basso", tone: "gray" };
}

export default function BeTalentPage() {
  const matches = buildMatches();
  const skills = buildSkillCoverage();
  const averageScore = Math.round(
    matches.reduce((total, match) => total + match.score, 0) / matches.length,
  );
  const strongMatches = matches.filter((match) => match.score >= 66).length;

  const matchColumns: Column<MatchResult>[] = [
    {
      key: "candidate",
      header: "Candidato",
      render: (match) => (
        <span className="font-medium">{match.candidateName}</span>
      ),
    },
    {
      key: "opening",
      header: "Posizione",
      render: (match) => (
        <div>
          <p>{match.openingTitle}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {match.openingCode}
          </p>
        </div>
      ),
    },
    {
      key: "shared",
      header: "Competenze in comune",
      render: (match) => (
        <span className="text-xs text-muted-foreground">
          {match.shared.length > 0 ? match.shared.join(" · ") : "Nessuna"}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (match) => (
        <div className="flex min-w-[150px] items-center gap-2">
          <ProgressBar value={match.score} accent={ACCENT} />
          <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {match.score}%
          </span>
        </div>
      ),
    },
    {
      key: "reco",
      header: "Raccomandazione",
      render: (match) => {
        const reco = recommendation(match.score);
        return <StatusBadge tone={reco.tone}>{reco.label}</StatusBadge>;
      },
    },
  ];

  const skillColumns: Column<SkillRow>[] = [
    {
      key: "skill",
      header: "Competenza",
      render: (row) => <span className="font-medium">{row.skill}</span>,
    },
    {
      key: "demand",
      header: "Richiesta",
      align: "right",
      render: (row) => `${row.demand} posizioni`,
    },
    {
      key: "supply",
      header: "Disponibile",
      align: "right",
      render: (row) => `${row.supply} candidati`,
    },
    {
      key: "coverage",
      header: "Copertura",
      render: (row) => (
        <div className="flex min-w-[140px] items-center gap-2">
          <ProgressBar
            value={Math.min(100, (row.supply / Math.max(row.demand, 1)) * 100)}
            accent={row.supply > 0 ? ACCENT : "#dc2626"}
          />
          <StatusBadge tone={row.supply > 0 ? "green" : "red"}>
            {row.supply > 0 ? "Coperta" : "Scoperta"}
          </StatusBadge>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader
        moduleKey="betalent"
        stats={[
          { label: "Match", value: String(matches.length) },
          { label: "Score medio", value: `${averageScore}%` },
          { label: "Match forti", value: String(strongMatches) },
          { label: "Candidati", value: String(p1Candidates.length) },
        ]}
      />

      <Section
        id="matching"
        title="Matching motivato"
        description="Accoppiamento candidato ↔ posizione per competenze condivise e score."
      >
        <DataTable
          caption="Matching motivato"
          columns={matchColumns}
          rows={matches}
          getRowKey={(match) => match.candidateName}
        />
      </Section>

      <Section
        id="competenze"
        title="Copertura competenze"
        description="Domanda dalle posizioni aperte rispetto all'offerta dei candidati."
        collapsible
        defaultOpen={false}
      >
        <DataTable
          caption="Copertura competenze"
          columns={skillColumns}
          rows={skills}
          getRowKey={(row) => row.skill}
        />
      </Section>
    </div>
  );
}
