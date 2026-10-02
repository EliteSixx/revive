# Revive: Tasks

Status keys: `[ ]` not started, `[~]` in progress, `[x]` done.
Every task references the PRD requirement or design section it implements. Update this file in the same pull request as the work.

---

## Phase 0: Documentation

- [x] Brief research on the problem statement
- [x] `prd.md`
- [x] `architecture.md`
- [x] `design.md`
- [x] `rules.md`
- [x] `tasks.md`
- [x] `memory.md`
- [ ] Team reviews all six documents and fills in M1 / M2 / M3 names in `memory.md`

## Phase 1: Basic UI shell (single branch, then merged to `main`)

Goal: every page from `design.md` section 10 exists with real layout and sample data, so the three members can branch off without touching shared files. **No features**: no database, no auth, no form submission logic.

### 1.1 Project setup

- [ ] Create Next.js app (App Router, TypeScript, Tailwind CSS v4, ESLint, `src/` directory, npm)
- [ ] Add Prettier; scripts `lint`, `typecheck`, `format`, `build`
- [ ] Add `.nvmrc` (Node 24), `.env.example`, update `.gitignore`
- [ ] Install `lucide-react`, `recharts`, `@tanstack/react-table`, `clsx`, `tailwind-merge`
- [ ] Initialise shadcn/ui and add only the primitives we use
- [ ] Record exact installed versions in `memory.md`

### 1.2 Foundations (shared)

- [ ] Design tokens in `src/app/globals.css` (`design.md` sections 3 to 5)
- [ ] Noto Sans via `next/font/google`; check tabular figures render
- [ ] Root layout with default metadata and title template "%s | Revive"
- [ ] `src/lib/cn.ts`, `src/lib/format.ts` (en-IN numbers, ₹, %, dates)
- [ ] `src/lib/metrics.ts`: metric definitions from PRD section 8 and `suppressSmallGroup()`
- [ ] `src/lib/constants.ts`: verification levels, outcome types, reason codes, follow-up windows, consent purposes
- [ ] `src/types/domain.ts`: domain types from `architecture.md` section 4
- [ ] `src/mocks/`: synthetic sample data (districts, programmes, courses, providers, batches, trainees, outcomes, follow-ups, employers, actions)
- [ ] Logotype component and favicon set (`design.md` section 9)

### 1.3 Shared components

- [ ] Button, Input, Select, Textarea, Checkbox, RadioGroup, Label, FieldError
- [ ] Card, Badge, VerificationBadge, StatusBadge
- [ ] DataTable (sorting, pagination, empty state)
- [ ] MetricTile (with n, verification share, suppression)
- [ ] ChartCard + BarChart, StackedBarChart, LineChart wrappers with "View as table"
- [ ] FilterBar
- [ ] PageHeader, Breadcrumbs, EmptyState, SampleDataNotice
- [ ] Dialog, Toast, Tabs, Stepper
- [ ] AppShell (top bar + sidebar, collapses below 1024px), TraineeShell (mobile single column)
- [ ] PublicHeader, PublicFooter (with disclaimer and legal links)
- [ ] `src/lib/navigation.ts`: sidebar items per role

### 1.4 Public pages (shared)

- [ ] Home (FR-S-01)
- [ ] How it works (FR-S-02)
- [ ] Privacy policy (FR-S-03): draft content, marked for team review
- [ ] Terms and conditions (FR-S-04): draft content, marked for team review
- [ ] Contact (FR-S-05)
- [ ] Accessibility statement (FR-S-06)
- [ ] Sign in (role tabs, static forms; links into each portal for now)
- [ ] 404 page

### 1.5 Portal page shells (layout + sample data, no logic)

Trainee (M1 area):
- [ ] Dashboard, Consent, Follow-up form (stepper, static), Report outcome, Profile

Follow-up agent (M1 area):
- [ ] Work queue, Call screen

Training provider (M2 area):
- [ ] Scorecard, Batches, Batch detail, Upload roster, Record placement, Actions

Employer (M2 area):
- [ ] Dashboard, Verifications, Hires, Skill feedback, Register

Government (M3 area):
- [ ] Overview, Cohorts, Providers, Provider detail, Districts, District detail, Demographics, Skill gaps, Data quality, Actions, Definitions, Settings

### 1.6 Phase 1 check before merging to `main`

- [ ] Lint, typecheck and build pass
- [ ] Every page checked at 360px, 768px and 1280px
- [ ] Accessibility checklist (`design.md` section 11) on every page
- [ ] Search the codebase for banned patterns: gradients, `rounded-full` on buttons/inputs, emoji, em dashes
- [ ] Every portal page shows the "Sample data" notice
- [ ] Merge to `main`; each member creates their feature branch from it

## Phase 2: Shared foundation (together, on `main`, before splitting)

Do this first so the three branches do not each invent their own database and auth.

- [ ] Choose auth library; record decision in `memory.md`
- [ ] Prisma schema from `architecture.md` section 4; first migration; seed script using the Phase 1 mocks
- [ ] Session handling and role guards (`src/server/auth`)
- [ ] Audit log helper
- [ ] Adapter interfaces + simulated implementations (messaging, EPFO, SIDH, business registry, file storage)
- [ ] pg-boss setup and worker entry point

## Phase 3: Features by stakeholder (separate branches)

### M1: Trainee + Follow-up agent (`feature/<name>-trainee`)

- [ ] FR-T-01 Phone OTP sign-in (simulated SMS)
- [ ] FR-T-02 Consent give / withdraw / history
- [ ] FR-T-03 Dashboard from real data
- [ ] FR-T-04 Follow-up form with branching questions
- [ ] FR-T-05 Report a new outcome
- [ ] FR-T-06 Update contact with OTP
- [ ] FR-T-07 Evidence upload
- [ ] FR-T-08 Training relevance rating
- [ ] Follow-up engine: task creation on certification, escalation jobs (`architecture.md` section 7)
- [ ] FR-A-01 Agent work queue
- [ ] FR-A-02 Call screen with scripted form
- [ ] FR-A-03 Attempt logging
- [ ] FR-A-04 Alternate contact switch
- [ ] FR-A-05 Callback scheduling

### M2: Training provider + Employer (`feature/<name>-provider`)

- [ ] FR-P-01 Batches list and detail
- [ ] FR-P-02 CSV roster upload with row-level validation
- [ ] FR-P-03 Record placement with evidence
- [ ] FR-P-04 Provider scorecard
- [ ] FR-P-05 Pending follow-ups view
- [ ] FR-P-06 Respond to remedial actions
- [ ] FR-E-01 Employer registration with GSTIN / Udyam format validation
- [ ] FR-E-02 Verification requests: confirm / correct / reject
- [ ] FR-E-03 Retention confirmation at W6 and W12
- [ ] FR-E-04 Skill-gap feedback
- [ ] Deduplication rules and merge queue (PRD 6.1)

### M3: Government (`feature/<name>-gov`)

- [ ] Analytics service with district scoping and suppression
- [ ] FR-G-01 Overview
- [ ] FR-G-02 Cohort analysis
- [ ] FR-G-03 Provider comparison and detail
- [ ] FR-G-04 District view and detail
- [ ] FR-G-05 Demographic breakdown
- [ ] FR-G-06 Skill gaps
- [ ] FR-G-07 Data quality
- [ ] FR-G-08 Remedial actions
- [ ] FR-G-09 Metric definitions page
- [ ] FR-G-10 Programme configuration
- [ ] FR-G-11 CSV export with suppression

## Phase 4: Integration and demo

- [ ] Merge all feature branches; resolve conflicts on `main`
- [ ] Run all 7 demo scenarios from PRD section 10 end to end
- [ ] Playwright smoke tests for the demo scenarios
- [ ] Final accessibility and banned-pattern sweep
- [ ] Final review of privacy policy and terms text

## Launch checklist (blockers, see `rules.md` section B)

- [ ] Custom domain connected with HTTPS
- [ ] Favicon set added
- [ ] "Made with AI" / builder badges removed
- [ ] Privacy policy page live
- [ ] Terms and conditions page live
