// Lightweight HTTP smoke test for all BeGear routes.
// Usage: node scripts/smoke.mjs  (dev server must be running on :3000)

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";

const routes = [
  { path: "/", label: "Dashboard" },
  { path: "/coremind", label: "CoreMind" },
  { path: "/betalent", label: "BeTalent" },
  { path: "/academy", label: "Academy" },
  { path: "/ats", label: "ATS Recruiting" },
  { path: "/placement", label: "Placement" },
  { path: "/gestionale", label: "Gestionale" },
  { path: "/turni", label: "Turni e risorse" },
  { path: "/staffing", label: "Staffing ICT" },
  { path: "/crm", label: "CRM B2B" },
  { path: "/input-hub", label: "Input Hub" },
  { path: "/integration-hub", label: "Integration Hub" },
  { path: "/documenti", label: "Documenti" },
  { path: "/compliance", label: "GDPR e Compliance" },
];

const errorMarkers = [
  "Application error",
  "Internal Server Error",
  "Unhandled Runtime Error",
];

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  }
}

for (const route of routes) {
  let res;
  let html = "";
  try {
    res = await fetch(`${BASE}${route.path}`);
    html = await res.text();
  } catch (error) {
    check(`[${route.path}] reachable`, false, String(error));
    continue;
  }

  check(`[${route.path}] HTTP 200`, res.status === 200, `status ${res.status}`);
  check(`[${route.path}] has sidebar`, html.includes("<aside"));
  check(`[${route.path}] mentions BeGear`, html.includes("BeGear"));
  check(`[${route.path}] shows label "${route.label}"`, html.includes(route.label));
  for (const marker of errorMarkers) {
    check(`[${route.path}] no "${marker}"`, !html.includes(marker));
  }
}

// 404 route should return 404
try {
  const res = await fetch(`${BASE}/rotta-inesistente-xyz`);
  check("[/rotta-inesistente-xyz] returns 404", res.status === 404, `status ${res.status}`);
} catch (error) {
  check("[404] reachable", false, String(error));
}

console.log(`\nSMOKE RESULT: ${passed} passed, ${failed} failed (${passed + failed} checks)`);
if (failures.length > 0) {
  console.log("\nFAILURES:");
  for (const failure of failures) {
    console.log(` - ${failure}`);
  }
  process.exit(1);
}
