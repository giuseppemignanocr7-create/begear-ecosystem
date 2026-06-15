insert into public.tenants (
  slug,
  legal_name,
  vat_number,
  payoff,
  claim,
  phone,
  email,
  authorization,
  certifications,
  metadata
)
values (
  'begear',
  'BeGear S.r.l.',
  '06709661216',
  'Developing Digital Talents',
  'L''ingranaggio che trasforma il tuo business',
  '02 829 406 75',
  'ufficiomarketing@begear.it',
  'Agenzia per il Lavoro autorizzata Min. dal 15/11/2018, Albo Informatico sezioni 4 e 5',
  array['ISO 27001', 'ISO 9001:2015 Istituto Giordano', 'Accredia', 'Partner certificato SAP'],
  jsonb_build_object(
    'experience_years', 20,
    'professionals_trained', 2000,
    'placement_within_six_months_percent', 97,
    'active_s4hana_consultants', 200
  )
)
on conflict (slug) do update set
  legal_name = excluded.legal_name,
  vat_number = excluded.vat_number,
  payoff = excluded.payoff,
  claim = excluded.claim,
  phone = excluded.phone,
  email = excluded.email,
  authorization = excluded.authorization,
  certifications = excluded.certifications,
  metadata = excluded.metadata;

insert into public.offices (tenant_id, city, address, purpose)
select tenant.id, office.city, office.address, office.purpose
from public.tenants tenant
cross join (
  values
    ('Napoli', 'Centro Direzionale, Isola E7, 80143', 'Direzione operativa, Academy e recruiting'),
    ('Milano', 'Piazza Gae Aulenti, Torre B, 20154', 'Relazioni enterprise, staffing e consulenza'),
    ('Lecce', 'Via Colonnello Costadura 2/C, 73100', 'Supporto formazione e delivery territoriale')
) as office(city, address, purpose)
where tenant.slug = 'begear'
on conflict (tenant_id, city) do update set
  address = excluded.address,
  purpose = excluded.purpose;

insert into public.roles (tenant_id, code, name, description)
select tenant.id, role.code, role.name, role.description
from public.tenants tenant
cross join (
  values
    ('platform_admin', 'Platform Admin', 'Governo tecnico della piattaforma Ecosystem Ω'),
    ('tenant_admin', 'Tenant Admin', 'Amministrazione BeGear e configurazioni tenant'),
    ('academy_manager', 'Academy Manager', 'Gestione corsi, edizioni, presenze e assessment'),
    ('recruiter', 'Recruiter', 'Gestione pipeline ATS, screening e colloqui'),
    ('placement_manager', 'Placement Manager', 'Coaching alumni, matching partner e outcome placement'),
    ('staffing_manager', 'Staffing Manager', 'Allocazioni consulenti, progetti ICT e timesheet'),
    ('sales_manager', 'Sales Manager', 'CRM B2B, offerte e Academy-as-a-Service'),
    ('compliance_manager', 'Compliance Manager', 'GDPR, audit, policy e autorizzazioni')
) as role(code, name, description)
where tenant.slug = 'begear'
on conflict (tenant_id, code) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.modules (module_key, label, tier, route_path, icon_key, sort_order)
values
  ('dashboard', 'Dashboard globale', 'tier_1', '/#dashboard', 'dashboard', 10),
  ('coremind', 'CoreMind Ω', 'tier_1', '/#coremind', 'ai', 20),
  ('betalent', 'BeTalent', 'tier_1', '/#betalent', 'ats', 30),
  ('academy', 'Academy LMS', 'tier_2', '/#academy', 'academy', 40),
  ('ats', 'ATS Recruiting', 'tier_2', '/#ats', 'ats', 50),
  ('placement', 'Placement', 'tier_2', '/#placement', 'placement', 60),
  ('gestionale', 'Gestionale', 'tier_2', '/#gestionale', 'management', 70),
  ('turni', 'Turni e risorse', 'tier_2', '/#turni', 'shifts', 80),
  ('staffing', 'Staffing ICT', 'tier_3', '/#staffing', 'staffing', 90),
  ('crm', 'CRM B2B', 'tier_3', '/#crm', 'crm', 100),
  ('input_hub', 'Input Hub', 'tier_2', '/#input-hub', 'input', 110),
  ('integration_hub', 'Integration Hub', 'tier_3', '/#integration-hub', 'integrations', 120),
  ('documents', 'Documenti', 'tier_3', '/#documenti', 'documents', 130),
  ('compliance', 'GDPR e Compliance', 'tier_3', '/#compliance', 'compliance', 140)
on conflict (module_key) do update set
  label = excluded.label,
  tier = excluded.tier,
  route_path = excluded.route_path,
  icon_key = excluded.icon_key,
  sort_order = excluded.sort_order,
  is_enabled = true;

insert into public.app_users (tenant_id, email, display_name, job_title, status, primary_office_id)
select tenant.id, user_seed.email, user_seed.display_name, user_seed.job_title, 'active', office.id
from public.tenants tenant
join (
  values
    ('platform@begear.it', 'Direzione Piattaforma BeGear', 'Platform Owner', 'Napoli'),
    ('academy@begear.it', 'Direzione Academy BeGear', 'Academy Manager', 'Napoli'),
    ('recruiting@begear.it', 'Team Recruiting BeGear', 'Recruiting Lead', 'Napoli'),
    ('placement@begear.it', 'Team Placement BeGear', 'Placement Lead', 'Milano'),
    ('staffing@begear.it', 'Team Staffing ICT BeGear', 'Staffing Lead', 'Milano'),
    ('sales@begear.it', 'Relazioni Enterprise BeGear', 'Sales Lead', 'Milano'),
    ('compliance@begear.it', 'Presidio Compliance BeGear', 'Compliance Lead', 'Lecce')
) as user_seed(email, display_name, job_title, city) on true
join public.offices office on office.tenant_id = tenant.id and office.city = user_seed.city
where tenant.slug = 'begear'
on conflict (tenant_id, email) do update set
  display_name = excluded.display_name,
  job_title = excluded.job_title,
  status = excluded.status,
  primary_office_id = excluded.primary_office_id;

insert into public.user_roles (tenant_id, user_id, role_id)
select tenant.id, app_user.id, role.id
from public.tenants tenant
join (
  values
    ('platform@begear.it', 'platform_admin'),
    ('platform@begear.it', 'tenant_admin'),
    ('academy@begear.it', 'academy_manager'),
    ('recruiting@begear.it', 'recruiter'),
    ('placement@begear.it', 'placement_manager'),
    ('staffing@begear.it', 'staffing_manager'),
    ('sales@begear.it', 'sales_manager'),
    ('compliance@begear.it', 'compliance_manager')
) as assignment(email, role_code) on true
join public.app_users app_user on app_user.tenant_id = tenant.id and app_user.email = assignment.email
join public.roles role on role.tenant_id = tenant.id and role.code = assignment.role_code
where tenant.slug = 'begear'
on conflict (user_id, role_id) do nothing;

insert into public.role_module_permissions (tenant_id, role_id, module_id, can_read, can_write, can_approve)
select tenant.id, role.id, module.id, true, permission.can_write, permission.can_approve
from public.tenants tenant
join public.roles role on role.tenant_id = tenant.id
join (
  values
    ('platform_admin', 'dashboard', true, true),
    ('platform_admin', 'coremind', true, true),
    ('platform_admin', 'betalent', true, true),
    ('platform_admin', 'academy', true, true),
    ('platform_admin', 'ats', true, true),
    ('platform_admin', 'placement', true, true),
    ('platform_admin', 'gestionale', true, true),
    ('platform_admin', 'turni', true, true),
    ('platform_admin', 'staffing', true, true),
    ('platform_admin', 'crm', true, true),
    ('platform_admin', 'input_hub', true, true),
    ('platform_admin', 'integration_hub', true, true),
    ('platform_admin', 'documents', true, true),
    ('platform_admin', 'compliance', true, true),
    ('tenant_admin', 'dashboard', true, true),
    ('tenant_admin', 'coremind', true, true),
    ('tenant_admin', 'academy', true, true),
    ('tenant_admin', 'ats', true, true),
    ('tenant_admin', 'placement', true, true),
    ('tenant_admin', 'gestionale', true, true),
    ('tenant_admin', 'turni', true, true),
    ('tenant_admin', 'staffing', true, true),
    ('tenant_admin', 'crm', true, true),
    ('tenant_admin', 'input_hub', true, true),
    ('tenant_admin', 'integration_hub', true, true),
    ('tenant_admin', 'documents', true, true),
    ('tenant_admin', 'compliance', true, true),
    ('academy_manager', 'dashboard', true, false),
    ('academy_manager', 'coremind', true, false),
    ('academy_manager', 'academy', true, true),
    ('academy_manager', 'input_hub', true, false),
    ('academy_manager', 'documents', true, false),
    ('recruiter', 'dashboard', true, false),
    ('recruiter', 'coremind', true, false),
    ('recruiter', 'betalent', true, false),
    ('recruiter', 'ats', true, true),
    ('recruiter', 'input_hub', true, false),
    ('placement_manager', 'dashboard', true, false),
    ('placement_manager', 'coremind', true, false),
    ('placement_manager', 'placement', true, true),
    ('placement_manager', 'betalent', true, false),
    ('staffing_manager', 'dashboard', true, false),
    ('staffing_manager', 'coremind', true, false),
    ('staffing_manager', 'gestionale', true, true),
    ('staffing_manager', 'turni', true, true),
    ('staffing_manager', 'staffing', true, true),
    ('sales_manager', 'dashboard', true, false),
    ('sales_manager', 'coremind', true, false),
    ('sales_manager', 'crm', true, true),
    ('sales_manager', 'staffing', true, false),
    ('sales_manager', 'academy', true, false),
    ('compliance_manager', 'dashboard', true, false),
    ('compliance_manager', 'compliance', true, true),
    ('compliance_manager', 'documents', true, true),
    ('compliance_manager', 'integration_hub', true, false)
) as permission(role_code, module_key, can_write, can_approve) on permission.role_code = role.code
join public.modules module on module.module_key = permission.module_key
where tenant.slug = 'begear'
on conflict (role_id, module_id) do update set
  can_read = excluded.can_read,
  can_write = excluded.can_write,
  can_approve = excluded.can_approve;
