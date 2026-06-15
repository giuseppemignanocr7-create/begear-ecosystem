export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ModuleTier = "tier_1" | "tier_2" | "tier_3";
export type UserStatus = "active" | "invited" | "suspended";
export type CourseStatus = "planned" | "active" | "completed" | "archived";
export type OpeningStatus = "active" | "screening" | "interviewing" | "closed";
export type AccountStatus = "active" | "qualified" | "proposal" | "won" | "archived";
export type ProjectStatus = "planned" | "active" | "paused" | "completed";
export type AllocationStatus = "proposed" | "active" | "paused" | "completed";
export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";
export type ShiftStatus = "planned" | "assigned" | "confirmed" | "completed";

type DefaultColumns = "id" | "created_at" | "updated_at";
type InsertRow<Row, Defaulted extends keyof Row = never> = Omit<
  Row,
  Defaulted | Extract<DefaultColumns, keyof Row>
> &
  Partial<Pick<Row, Defaulted | Extract<DefaultColumns, keyof Row>>>;
type UpdateRow<Row> = Partial<Row>;

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationship[];
};

export type TenantRow = {
  id: string;
  slug: string;
  legal_name: string;
  vat_number: string;
  payoff: string;
  claim: string;
  phone: string;
  email: string;
  authorization: string;
  certifications: string[];
  metadata: Json;
  created_at: string;
  updated_at: string;
};

export type OfficeRow = {
  id: string;
  tenant_id: string;
  city: string;
  address: string;
  purpose: string;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type RoleRow = {
  id: string;
  tenant_id: string;
  code: string;
  name: string;
  description: string;
  created_at: string;
};

export type AppUserRow = {
  id: string;
  tenant_id: string;
  email: string;
  display_name: string;
  job_title: string;
  status: UserStatus;
  primary_office_id: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRoleRow = {
  tenant_id: string;
  user_id: string;
  role_id: string;
  created_at: string;
};

export type ModuleRow = {
  id: string;
  module_key: string;
  label: string;
  tier: ModuleTier;
  route_path: string;
  icon_key: string;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
};

export type RoleModulePermissionRow = {
  tenant_id: string;
  role_id: string;
  module_id: string;
  can_read: boolean;
  can_write: boolean;
  can_approve: boolean;
  created_at: string;
};

export type AcademyCourseRow = {
  id: string;
  tenant_id: string;
  course_code: string;
  title: string;
  domain: string;
  delivery_mode: string;
  duration_hours: number;
  status: CourseStatus;
  certification_label: string | null;
  placement_kpi: string | null;
  created_at: string;
  updated_at: string;
};

export type AcademyEditionRow = {
  id: string;
  tenant_id: string;
  course_id: string;
  office_id: string;
  edition_code: string;
  title: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled_count: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
};

export type JobOpeningRow = {
  id: string;
  tenant_id: string;
  opening_code: string;
  title: string;
  business_area: string;
  location: string;
  contract_type: string;
  status: OpeningStatus;
  priority_score: number;
  required_skills: string[];
  created_at: string;
  updated_at: string;
};

export type CandidateRow = {
  id: string;
  tenant_id: string;
  profile_code: string;
  display_name: string;
  email: string | null;
  headline: string;
  source: string;
  status: string;
  skills: string[];
  created_at: string;
  updated_at: string;
};

export type PlacementRow = {
  id: string;
  tenant_id: string;
  candidate_id: string;
  job_opening_id: string;
  outcome_label: string;
  placed_at: string | null;
  coaching_notes: string;
  created_at: string;
  updated_at: string;
};

export type BusinessAccountRow = {
  id: string;
  tenant_id: string;
  legal_name: string;
  vat_number: string | null;
  industry: string;
  account_owner_id: string | null;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  tenant_id: string;
  account_id: string;
  project_code: string;
  name: string;
  service_line: string;
  start_date: string;
  end_date: string | null;
  status: ProjectStatus;
  budget_cents: number;
  created_at: string;
  updated_at: string;
};

export type ConsultantRow = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  profile_code: string;
  display_name: string;
  seniority: string;
  primary_skill: string;
  availability_status: string;
  daily_rate_cents: number;
  created_at: string;
  updated_at: string;
};

export type ConsultantAllocationRow = {
  id: string;
  tenant_id: string;
  project_id: string;
  consultant_id: string;
  status: AllocationStatus;
  start_date: string;
  end_date: string | null;
  allocation_percentage: number;
  billable: boolean;
  created_at: string;
  updated_at: string;
};

export type TimesheetRow = {
  id: string;
  tenant_id: string;
  consultant_id: string;
  project_id: string;
  work_date: string;
  hours: number;
  activity: string;
  status: TimesheetStatus;
  created_at: string;
  updated_at: string;
};

export type ResourceShiftRow = {
  id: string;
  tenant_id: string;
  office_id: string;
  assigned_user_id: string | null;
  starts_at: string;
  ends_at: string;
  status: ShiftStatus;
  activity: string;
  created_at: string;
  updated_at: string;
};

export type AuditEventRow = {
  id: string;
  tenant_id: string;
  actor_user_id: string | null;
  event_type: string;
  entity_table: string;
  entity_id: string | null;
  payload: Json;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      tenants: TableDefinition<
        TenantRow,
        InsertRow<TenantRow, "certifications" | "metadata">,
        UpdateRow<TenantRow>
      >;
      offices: TableDefinition<
        OfficeRow,
        InsertRow<OfficeRow, "timezone">,
        UpdateRow<OfficeRow>
      >;
      roles: TableDefinition<RoleRow, InsertRow<RoleRow>, UpdateRow<RoleRow>>;
      app_users: TableDefinition<
        AppUserRow,
        InsertRow<AppUserRow, "status" | "primary_office_id">,
        UpdateRow<AppUserRow>
      >;
      user_roles: TableDefinition<
        UserRoleRow,
        InsertRow<UserRoleRow>,
        UpdateRow<UserRoleRow>
      >;
      modules: TableDefinition<
        ModuleRow,
        InsertRow<ModuleRow, "is_enabled">,
        UpdateRow<ModuleRow>
      >;
      role_module_permissions: TableDefinition<
        RoleModulePermissionRow,
        InsertRow<RoleModulePermissionRow, "can_read" | "can_write" | "can_approve">,
        UpdateRow<RoleModulePermissionRow>
      >;
      academy_courses: TableDefinition<
        AcademyCourseRow,
        InsertRow<AcademyCourseRow, "status" | "certification_label" | "placement_kpi">,
        UpdateRow<AcademyCourseRow>
      >;
      academy_editions: TableDefinition<
        AcademyEditionRow,
        InsertRow<AcademyEditionRow, "enrolled_count" | "status">,
        UpdateRow<AcademyEditionRow>
      >;
      job_openings: TableDefinition<
        JobOpeningRow,
        InsertRow<JobOpeningRow, "status" | "required_skills">,
        UpdateRow<JobOpeningRow>
      >;
      candidates: TableDefinition<
        CandidateRow,
        InsertRow<CandidateRow, "email" | "skills">,
        UpdateRow<CandidateRow>
      >;
      placements: TableDefinition<
        PlacementRow,
        InsertRow<PlacementRow, "placed_at">,
        UpdateRow<PlacementRow>
      >;
      business_accounts: TableDefinition<
        BusinessAccountRow,
        InsertRow<BusinessAccountRow, "vat_number" | "account_owner_id" | "status">,
        UpdateRow<BusinessAccountRow>
      >;
      projects: TableDefinition<
        ProjectRow,
        InsertRow<ProjectRow, "end_date" | "status" | "budget_cents">,
        UpdateRow<ProjectRow>
      >;
      consultants: TableDefinition<
        ConsultantRow,
        InsertRow<ConsultantRow, "user_id">,
        UpdateRow<ConsultantRow>
      >;
      consultant_allocations: TableDefinition<
        ConsultantAllocationRow,
        InsertRow<ConsultantAllocationRow, "status" | "end_date" | "billable">,
        UpdateRow<ConsultantAllocationRow>
      >;
      timesheets: TableDefinition<
        TimesheetRow,
        InsertRow<TimesheetRow, "status">,
        UpdateRow<TimesheetRow>
      >;
      resource_shifts: TableDefinition<
        ResourceShiftRow,
        InsertRow<ResourceShiftRow, "assigned_user_id" | "status">,
        UpdateRow<ResourceShiftRow>
      >;
      audit_events: TableDefinition<
        AuditEventRow,
        InsertRow<AuditEventRow, "actor_user_id" | "entity_id" | "payload">,
        UpdateRow<AuditEventRow>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      can_manage_tenant: {
        Args: { target_tenant_id: string; role_codes: string[] };
        Returns: boolean;
      };
      can_read_tenant: {
        Args: { target_tenant_id: string };
        Returns: boolean;
      };
      current_role_codes: {
        Args: Record<string, never>;
        Returns: string[];
      };
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      has_any_app_role: {
        Args: { role_codes: string[] };
        Returns: boolean;
      };
      has_app_role: {
        Args: { role_code: string };
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      account_status: AccountStatus;
      allocation_status: AllocationStatus;
      course_status: CourseStatus;
      module_tier: ModuleTier;
      opening_status: OpeningStatus;
      project_status: ProjectStatus;
      shift_status: ShiftStatus;
      timesheet_status: TimesheetStatus;
      user_status: UserStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type TableName = keyof Database["public"]["Tables"];
export type Tables<Table extends TableName> = Database["public"]["Tables"][Table]["Row"];
export type TablesInsert<Table extends TableName> =
  Database["public"]["Tables"][Table]["Insert"];
export type TablesUpdate<Table extends TableName> =
  Database["public"]["Tables"][Table]["Update"];
export type Enums<EnumName extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][EnumName];
