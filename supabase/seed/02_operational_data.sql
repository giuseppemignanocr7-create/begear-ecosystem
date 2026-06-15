insert into public.academy_courses (
  tenant_id,
  course_code,
  title,
  domain,
  delivery_mode,
  duration_hours,
  status,
  certification_label,
  placement_kpi
)
select tenant.id, course.course_code, course.title, course.domain, course.delivery_mode, course.duration_hours, course.status, course.certification_label, course.placement_kpi
from public.tenants tenant
cross join (
  values
    ('SAP-S4-2026', 'Master SAP S/4HANA Consultant', 'SAP', 'Blended Napoli e remoto', 240, 'active'::public.course_status, 'Partner certificato SAP', 'Placement 97% entro 6 mesi'),
    ('AI-CYB-2026', 'AI e Cybersecurity Specialist', 'AI e Cybersecurity', 'Live remoto con laboratorio', 180, 'planned'::public.course_status, 'ISO 27001 learning path', 'Pipeline partner enterprise'),
    ('FULLSTACK-2026', 'Full Stack Developer Enterprise', 'Software Engineering', 'Blended Lecce e remoto', 220, 'active'::public.course_status, 'Portfolio project review', 'Inserimento su team ICT')
) as course(course_code, title, domain, delivery_mode, duration_hours, status, certification_label, placement_kpi)
where tenant.slug = 'begear'
on conflict (tenant_id, course_code) do update set
  title = excluded.title,
  domain = excluded.domain,
  delivery_mode = excluded.delivery_mode,
  duration_hours = excluded.duration_hours,
  status = excluded.status,
  certification_label = excluded.certification_label,
  placement_kpi = excluded.placement_kpi;

insert into public.academy_editions (
  tenant_id,
  course_id,
  office_id,
  edition_code,
  title,
  start_date,
  end_date,
  capacity,
  enrolled_count,
  status
)
select tenant.id, course.id, office.id, edition.edition_code, edition.title, edition.start_date, edition.end_date, edition.capacity, edition.enrolled_count, edition.status
from public.tenants tenant
join (
  values
    ('SAP-S4-2026', 'Napoli', 'SAP-S4-NA-Q1', 'Master SAP S/4HANA Napoli Q1', date '2026-02-02', date '2026-05-29', 28, 24, 'active'::public.course_status),
    ('AI-CYB-2026', 'Milano', 'AI-CYB-MI-Q2', 'AI e Cybersecurity Milano Q2', date '2026-04-13', date '2026-07-31', 24, 18, 'planned'::public.course_status),
    ('FULLSTACK-2026', 'Lecce', 'FULLSTACK-LE-Q1', 'Full Stack Developer Lecce Q1', date '2026-01-19', date '2026-05-15', 22, 21, 'active'::public.course_status)
) as edition(course_code, city, edition_code, title, start_date, end_date, capacity, enrolled_count, status) on true
join public.academy_courses course on course.tenant_id = tenant.id and course.course_code = edition.course_code
join public.offices office on office.tenant_id = tenant.id and office.city = edition.city
where tenant.slug = 'begear'
on conflict (tenant_id, edition_code) do update set
  course_id = excluded.course_id,
  office_id = excluded.office_id,
  title = excluded.title,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  capacity = excluded.capacity,
  enrolled_count = excluded.enrolled_count,
  status = excluded.status;

insert into public.job_openings (
  tenant_id,
  opening_code,
  title,
  business_area,
  location,
  contract_type,
  status,
  priority_score,
  required_skills
)
select tenant.id, opening.opening_code, opening.title, opening.business_area, opening.location, opening.contract_type, opening.status, opening.priority_score, opening.required_skills
from public.tenants tenant
cross join (
  values
    ('BG-SAP-001', 'SAP FI/CO Junior Consultant', 'Staffing SAP', 'Milano ibrido', 'Apprendistato professionalizzante', 'interviewing'::public.opening_status, 92, array['SAP FI', 'SAP CO', 'Excel', 'Inglese B2']),
    ('BG-AI-002', 'Cybersecurity Analyst Junior', 'Academy Placement', 'Napoli ibrido', 'Tempo determinato ICT', 'screening'::public.opening_status, 84, array['SIEM', 'ISO 27001', 'Python', 'Incident response']),
    ('BG-FE-003', 'Full Stack Developer React', 'Delivery software', 'Lecce remoto', 'Somministrazione ICT', 'active'::public.opening_status, 78, array['React', 'TypeScript', 'Node.js', 'PostgreSQL'])
) as opening(opening_code, title, business_area, location, contract_type, status, priority_score, required_skills)
where tenant.slug = 'begear'
on conflict (tenant_id, opening_code) do update set
  title = excluded.title,
  business_area = excluded.business_area,
  location = excluded.location,
  contract_type = excluded.contract_type,
  status = excluded.status,
  priority_score = excluded.priority_score,
  required_skills = excluded.required_skills;

insert into public.candidates (
  tenant_id,
  profile_code,
  display_name,
  email,
  headline,
  source,
  status,
  skills
)
select tenant.id, candidate.profile_code, candidate.display_name, candidate.email, candidate.headline, candidate.source, candidate.status, candidate.skills
from public.tenants tenant
cross join (
  values
    ('CND-SAP-001', 'Alumni SAP Finance Track', 'alumni.sap.finance@begear.it', 'Junior SAP FI/CO con laboratorio S/4HANA completato', 'Academy SAP S/4HANA Napoli', 'placement_ready', array['SAP FI', 'SAP CO', 'S/4HANA', 'Business process']),
    ('CND-CYB-002', 'Alumni Cybersecurity Track', 'alumni.cyber@begear.it', 'Cybersecurity analyst junior con focus ISO 27001', 'Academy AI e Cybersecurity', 'screening', array['SIEM', 'ISO 27001', 'Python', 'Risk assessment']),
    ('CND-FS-003', 'Alumni Full Stack Track', 'alumni.fullstack@begear.it', 'Full stack developer junior React e PostgreSQL', 'Academy Full Stack Lecce', 'interviewing', array['React', 'TypeScript', 'Node.js', 'PostgreSQL'])
) as candidate(profile_code, display_name, email, headline, source, status, skills)
where tenant.slug = 'begear'
on conflict (tenant_id, profile_code) do update set
  display_name = excluded.display_name,
  email = excluded.email,
  headline = excluded.headline,
  source = excluded.source,
  status = excluded.status,
  skills = excluded.skills;

insert into public.placements (tenant_id, candidate_id, job_opening_id, outcome_label, placed_at, coaching_notes)
select tenant.id, candidate.id, opening.id, placement.outcome_label, placement.placed_at, placement.coaching_notes
from public.tenants tenant
join (
  values
    ('CND-SAP-001', 'BG-SAP-001', 'Partner shortlist completata', date '2026-05-20', 'Profilo pronto per colloquio tecnico SAP FI/CO'),
    ('CND-FS-003', 'BG-FE-003', 'Colloquio tecnico pianificato', null::date, 'Portfolio React validato con feedback senior')
) as placement(profile_code, opening_code, outcome_label, placed_at, coaching_notes) on true
join public.candidates candidate on candidate.tenant_id = tenant.id and candidate.profile_code = placement.profile_code
join public.job_openings opening on opening.tenant_id = tenant.id and opening.opening_code = placement.opening_code
where tenant.slug = 'begear';

insert into public.business_accounts (tenant_id, legal_name, vat_number, industry, account_owner_id, status)
select tenant.id, account.legal_name, account.vat_number, account.industry, app_user.id, account.status
from public.tenants tenant
join (
  values
    ('Enterprise SAP Transformation S.p.A.', 'IT00000000001', 'Consulenza SAP enterprise', 'sales@begear.it', 'qualified'::public.account_status),
    ('Digital Banking Partner S.p.A.', 'IT00000000002', 'Financial services technology', 'sales@begear.it', 'proposal'::public.account_status),
    ('Manufacturing Cloud Group S.r.l.', 'IT00000000003', 'Industria e cloud operations', 'staffing@begear.it', 'active'::public.account_status)
) as account(legal_name, vat_number, industry, owner_email, status) on true
left join public.app_users app_user on app_user.tenant_id = tenant.id and app_user.email = account.owner_email
where tenant.slug = 'begear'
on conflict (tenant_id, legal_name) do update set
  vat_number = excluded.vat_number,
  industry = excluded.industry,
  account_owner_id = excluded.account_owner_id,
  status = excluded.status;

insert into public.projects (tenant_id, account_id, project_code, name, service_line, start_date, end_date, status, budget_cents)
select tenant.id, account.id, project.project_code, project.name, project.service_line, project.start_date, project.end_date, project.status, project.budget_cents
from public.tenants tenant
join (
  values
    ('Enterprise SAP Transformation S.p.A.', 'PRJ-SAP-AMS-2026', 'S/4HANA AMS Finance Factory', 'SAP consulting', date '2026-01-15', date '2026-12-31', 'active'::public.project_status, 42000000),
    ('Digital Banking Partner S.p.A.', 'PRJ-CYB-GRC-2026', 'GRC e Cybersecurity Enablement', 'Cybersecurity academy placement', date '2026-04-01', null::date, 'planned'::public.project_status, 18000000),
    ('Manufacturing Cloud Group S.r.l.', 'PRJ-FS-PLATFORM-2026', 'Cloud operations workforce pod', 'Staffing ICT', date '2026-02-01', date '2026-09-30', 'active'::public.project_status, 26000000)
) as project(account_name, project_code, name, service_line, start_date, end_date, status, budget_cents) on true
join public.business_accounts account on account.tenant_id = tenant.id and account.legal_name = project.account_name
where tenant.slug = 'begear'
on conflict (tenant_id, project_code) do update set
  account_id = excluded.account_id,
  name = excluded.name,
  service_line = excluded.service_line,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  status = excluded.status,
  budget_cents = excluded.budget_cents;

insert into public.consultants (tenant_id, user_id, profile_code, display_name, seniority, primary_skill, availability_status, daily_rate_cents)
select tenant.id, app_user.id, consultant.profile_code, consultant.display_name, consultant.seniority, consultant.primary_skill, consultant.availability_status, consultant.daily_rate_cents
from public.tenants tenant
join (
  values
    ('CONS-SAP-001', 'Consulente SAP S/4HANA Senior', 'Senior', 'SAP S/4HANA Finance', 'allocated', 72000, null::text),
    ('CONS-CYB-002', 'Cybersecurity Consultant ISO 27001', 'Middle', 'ISO 27001 e risk management', 'available', 56000, null::text),
    ('CONS-FS-003', 'Full Stack Consultant TypeScript', 'Middle', 'React e Node.js', 'allocated', 52000, null::text)
) as consultant(profile_code, display_name, seniority, primary_skill, availability_status, daily_rate_cents, email) on true
left join public.app_users app_user on app_user.tenant_id = tenant.id and app_user.email = consultant.email
where tenant.slug = 'begear'
on conflict (tenant_id, profile_code) do update set
  display_name = excluded.display_name,
  seniority = excluded.seniority,
  primary_skill = excluded.primary_skill,
  availability_status = excluded.availability_status,
  daily_rate_cents = excluded.daily_rate_cents;

insert into public.consultant_allocations (tenant_id, project_id, consultant_id, status, start_date, end_date, allocation_percentage, billable)
select tenant.id, project.id, consultant.id, allocation.status, allocation.start_date, allocation.end_date, allocation.allocation_percentage, allocation.billable
from public.tenants tenant
join (
  values
    ('PRJ-SAP-AMS-2026', 'CONS-SAP-001', 'active'::public.allocation_status, date '2026-01-15', date '2026-12-31', 80, true),
    ('PRJ-FS-PLATFORM-2026', 'CONS-FS-003', 'active'::public.allocation_status, date '2026-02-01', date '2026-09-30', 100, true),
    ('PRJ-CYB-GRC-2026', 'CONS-CYB-002', 'proposed'::public.allocation_status, date '2026-04-01', null::date, 60, true)
) as allocation(project_code, profile_code, status, start_date, end_date, allocation_percentage, billable) on true
join public.projects project on project.tenant_id = tenant.id and project.project_code = allocation.project_code
join public.consultants consultant on consultant.tenant_id = tenant.id and consultant.profile_code = allocation.profile_code
where tenant.slug = 'begear';

insert into public.timesheets (tenant_id, consultant_id, project_id, work_date, hours, activity, status)
select tenant.id, consultant.id, project.id, timesheet.work_date, timesheet.hours, timesheet.activity, timesheet.status
from public.tenants tenant
join (
  values
    ('CONS-SAP-001', 'PRJ-SAP-AMS-2026', date '2026-06-08', 7.50::numeric, 'Blueprint finance e supporto AMS', 'approved'::public.timesheet_status),
    ('CONS-FS-003', 'PRJ-FS-PLATFORM-2026', date '2026-06-08', 8.00::numeric, 'Sviluppo componenti React e API Node.js', 'submitted'::public.timesheet_status),
    ('CONS-CYB-002', 'PRJ-CYB-GRC-2026', date '2026-06-08', 4.00::numeric, 'Assessment ISO 27001 e piano controlli', 'draft'::public.timesheet_status)
) as timesheet(profile_code, project_code, work_date, hours, activity, status) on true
join public.consultants consultant on consultant.tenant_id = tenant.id and consultant.profile_code = timesheet.profile_code
join public.projects project on project.tenant_id = tenant.id and project.project_code = timesheet.project_code
where tenant.slug = 'begear'
on conflict (consultant_id, project_id, work_date) do update set
  hours = excluded.hours,
  activity = excluded.activity,
  status = excluded.status;

insert into public.resource_shifts (tenant_id, office_id, assigned_user_id, starts_at, ends_at, status, activity)
select tenant.id, office.id, app_user.id, shift.starts_at, shift.ends_at, shift.status, shift.activity
from public.tenants tenant
join (
  values
    ('Napoli', 'academy@begear.it', timestamptz '2026-06-15 09:00:00+02', timestamptz '2026-06-15 13:00:00+02', 'confirmed'::public.shift_status, 'Aula SAP S/4HANA e assessment pratico'),
    ('Milano', 'staffing@begear.it', timestamptz '2026-06-15 14:00:00+02', timestamptz '2026-06-15 18:00:00+02', 'assigned'::public.shift_status, 'Staffing review con partner enterprise'),
    ('Lecce', 'compliance@begear.it', timestamptz '2026-06-16 10:00:00+02', timestamptz '2026-06-16 12:00:00+02', 'planned'::public.shift_status, 'Verifica documentale GDPR e policy Academy')
) as shift(city, email, starts_at, ends_at, status, activity) on true
join public.offices office on office.tenant_id = tenant.id and office.city = shift.city
left join public.app_users app_user on app_user.tenant_id = tenant.id and app_user.email = shift.email
where tenant.slug = 'begear';

insert into public.audit_events (tenant_id, actor_user_id, event_type, entity_table, entity_id, payload)
select tenant.id, app_user.id, 'seed.p1.loaded', 'tenants', tenant.id, jsonb_build_object('source', 'supabase seed', 'scope', 'P1 database foundation')
from public.tenants tenant
left join public.app_users app_user on app_user.tenant_id = tenant.id and app_user.email = 'platform@begear.it'
where tenant.slug = 'begear';
