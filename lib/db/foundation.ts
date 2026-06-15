import type { PostgrestError } from "@supabase/supabase-js";

import type { BeGearSupabaseClient } from "@/lib/db/supabase";
import type { Tables } from "@/types/database";

export type TenantFoundation = {
  tenant: Tables<"tenants">;
  offices: Tables<"offices">[];
  roles: Tables<"roles">[];
  modules: Tables<"modules">[];
  permissions: Tables<"role_module_permissions">[];
};

export type OperationalOverview = {
  courses: Tables<"academy_courses">[];
  editions: Tables<"academy_editions">[];
  jobOpenings: Tables<"job_openings">[];
  candidates: Tables<"candidates">[];
  placements: Tables<"placements">[];
  accounts: Tables<"business_accounts">[];
  projects: Tables<"projects">[];
  consultants: Tables<"consultants">[];
  allocations: Tables<"consultant_allocations">[];
  timesheets: Tables<"timesheets">[];
  shifts: Tables<"resource_shifts">[];
  auditEvents: Tables<"audit_events">[];
};

function requireSingle<T>(
  data: T | null | undefined,
  error: PostgrestError | null,
  label: string,
): NonNullable<T> {
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }

  if (data === null || data === undefined) {
    throw new Error(`${label}: nessun record disponibile`);
  }

  return data as NonNullable<T>;
}

function requireList<T>(
  data: T[] | null,
  error: PostgrestError | null,
  label: string,
): T[] {
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }

  return data ?? [];
}

export async function loadTenantFoundation(
  client: BeGearSupabaseClient,
  tenantSlug = "begear",
): Promise<TenantFoundation> {
  const tenantResponse = await client
    .from("tenants")
    .select("*")
    .eq("slug", tenantSlug)
    .single();
  const tenant = requireSingle<Tables<"tenants">>(
    tenantResponse.data as Tables<"tenants"> | null,
    tenantResponse.error,
    "Caricamento tenant BeGear",
  );

  const [officesResponse, rolesResponse, modulesResponse, permissionsResponse] =
    await Promise.all([
      client
        .from("offices")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("city", { ascending: true }),
      client
        .from("roles")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("code", { ascending: true }),
      client
        .from("modules")
        .select("*")
        .eq("is_enabled", true)
        .order("sort_order", { ascending: true }),
      client.from("role_module_permissions").select("*").eq("tenant_id", tenant.id),
    ]);

  return {
    tenant,
    offices: requireList<Tables<"offices">>(
      officesResponse.data as Tables<"offices">[] | null,
      officesResponse.error,
      "Caricamento sedi BeGear",
    ),
    roles: requireList<Tables<"roles">>(
      rolesResponse.data as Tables<"roles">[] | null,
      rolesResponse.error,
      "Caricamento ruoli BeGear",
    ),
    modules: requireList<Tables<"modules">>(
      modulesResponse.data as Tables<"modules">[] | null,
      modulesResponse.error,
      "Caricamento moduli Ecosystem Ω",
    ),
    permissions: requireList<Tables<"role_module_permissions">>(
      permissionsResponse.data as Tables<"role_module_permissions">[] | null,
      permissionsResponse.error,
      "Caricamento permessi RBAC",
    ),
  };
}

export async function loadOperationalOverview(
  client: BeGearSupabaseClient,
  tenantId: string,
): Promise<OperationalOverview> {
  const [
    coursesResponse,
    editionsResponse,
    openingsResponse,
    candidatesResponse,
    placementsResponse,
    accountsResponse,
    projectsResponse,
    consultantsResponse,
    allocationsResponse,
    timesheetsResponse,
    shiftsResponse,
    auditEventsResponse,
  ] = await Promise.all([
    client
      .from("academy_courses")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("course_code", { ascending: true }),
    client
      .from("academy_editions")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("start_date", { ascending: true }),
    client
      .from("job_openings")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("priority_score", { ascending: false }),
    client
      .from("candidates")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("profile_code", { ascending: true }),
    client
      .from("placements")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
    client
      .from("business_accounts")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("legal_name", { ascending: true }),
    client
      .from("projects")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("project_code", { ascending: true }),
    client
      .from("consultants")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("profile_code", { ascending: true }),
    client
      .from("consultant_allocations")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("start_date", { ascending: true }),
    client
      .from("timesheets")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("work_date", { ascending: false }),
    client
      .from("resource_shifts")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("starts_at", { ascending: true }),
    client
      .from("audit_events")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    courses: requireList<Tables<"academy_courses">>(
      coursesResponse.data as Tables<"academy_courses">[] | null,
      coursesResponse.error,
      "Caricamento corsi Academy",
    ),
    editions: requireList<Tables<"academy_editions">>(
      editionsResponse.data as Tables<"academy_editions">[] | null,
      editionsResponse.error,
      "Caricamento edizioni Academy",
    ),
    jobOpenings: requireList<Tables<"job_openings">>(
      openingsResponse.data as Tables<"job_openings">[] | null,
      openingsResponse.error,
      "Caricamento posizioni ATS",
    ),
    candidates: requireList<Tables<"candidates">>(
      candidatesResponse.data as Tables<"candidates">[] | null,
      candidatesResponse.error,
      "Caricamento candidati",
    ),
    placements: requireList<Tables<"placements">>(
      placementsResponse.data as Tables<"placements">[] | null,
      placementsResponse.error,
      "Caricamento placement",
    ),
    accounts: requireList<Tables<"business_accounts">>(
      accountsResponse.data as Tables<"business_accounts">[] | null,
      accountsResponse.error,
      "Caricamento account CRM",
    ),
    projects: requireList<Tables<"projects">>(
      projectsResponse.data as Tables<"projects">[] | null,
      projectsResponse.error,
      "Caricamento progetti",
    ),
    consultants: requireList<Tables<"consultants">>(
      consultantsResponse.data as Tables<"consultants">[] | null,
      consultantsResponse.error,
      "Caricamento consulenti",
    ),
    allocations: requireList<Tables<"consultant_allocations">>(
      allocationsResponse.data as Tables<"consultant_allocations">[] | null,
      allocationsResponse.error,
      "Caricamento allocazioni",
    ),
    timesheets: requireList<Tables<"timesheets">>(
      timesheetsResponse.data as Tables<"timesheets">[] | null,
      timesheetsResponse.error,
      "Caricamento timesheet",
    ),
    shifts: requireList<Tables<"resource_shifts">>(
      shiftsResponse.data as Tables<"resource_shifts">[] | null,
      shiftsResponse.error,
      "Caricamento turni",
    ),
    auditEvents: requireList<Tables<"audit_events">>(
      auditEventsResponse.data as Tables<"audit_events">[] | null,
      auditEventsResponse.error,
      "Caricamento audit events",
    ),
  };
}
