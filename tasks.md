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

- [x] Create Next.js app (App Router, TypeScript, Tailwind CSS v4, ESLint, `src/` directory, npm)
- [x] Add Prettier; scripts `lint`, `typecheck`, `format`, `format:check`, `build`
- [x] Add `.nvmrc` (Node 24), `.env.example`, update `.gitignore`
- [x] Install `lucide-react`, `recharts`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge` (TanStack Table dropped; see `memory.md`)
- [x] shadcn/ui pattern without the CLI: our own primitives on Radix (see `architecture.md` section 1)
- [x] Record exact installed versions in `memory.md`

### 1.2 Foundations (shared)

- [x] Design tokens in `src/app/globals.css` (`design.md` sections 3 to 5); Tailwind defaults switched off
- [x] Noto Sans via `next/font/google`; digits checked to be equal width
- [x] Root layout with default metadata and title template "%s | Revive"
- [x] `src/lib/cn.ts`, `src/lib/format.ts` (en-IN numbers, rupees, %, dates)
- [x] `src/lib/metrics.ts`: metric definitions from PRD section 8, rates and small-group suppression
- [x] `src/lib/constants.ts`: labels, verification levels, outcome types, reason codes, follow-up windows, consent purposes
- [x] `src/types/domain.ts` and `src/types/analytics.ts`
- [x] `src/mocks/`: seeded synthetic trainee records plus portal sample data
- [x] Logotype component and favicon set (`design.md` section 9)

### 1.3 Shared components

- [x] Button, Input, Select, Textarea, Choice (checkbox and radio), ChoiceGroup, Field (label, helper, error)
- [x] Card, Badge, VerificationBadge, StatusBadge
- [x] DataTable (empty state, total count, sorting, pagination)
- [x] MetricTile (with n, verification share, suppression) and OutcomeSummaryTiles
- [x] ChartCard with one Recharts wrapper for bar, stacked bar and line, plus "View as table"
- [x] FilterBar (visual only in Phase 1)
- [x] PageHeader, Breadcrumbs, EmptyState, SampleDataNotice, DraftNotice
- [x] Dialog (confirmations), Tabs, Stepper
- [x] Toast (`useToast`), added in 1.7
- [x] AppShell (top bar + sidebar, collapses below 1024px), TraineeShell (mobile single column)
- [x] PublicHeader, PublicFooter (with disclaimer and legal links), PublicFrame
- [x] `src/lib/navigation.ts`: sidebar items per portal

### 1.4 Public pages (shared)

- [x] Home (FR-S-01)
- [x] How it works (FR-S-02)
- [x] Privacy policy (FR-S-03): draft content, marked for team review
- [x] Terms and conditions (FR-S-04): draft content, marked for team review
- [x] Contact (FR-S-05): team contact details still to be added (`TODO(copy)`)
- [x] Accessibility statement (FR-S-06)
- [x] Sign in (role tabs, static forms; links into each portal for now)
- [x] 404 page

### 1.5 Portal page shells (layout + sample data, no logic)

Trainee (M1 area):
- [x] Home, Consent, Follow-up form (stepper, first question only), Report a change, Profile

Follow-up agent (M1 area):
- [x] Work queue, Call screen

Training provider (M2 area):
- [x] Scorecard, Batches, Batch detail, Upload roster, Record placement, Actions

Employer (M2 area):
- [x] Dashboard, Verifications, Hires, Skill feedback, Register

Government (M3 area):
- [x] Overview, Cohorts, Providers, Provider detail, Districts, District detail, Demographics, Skill gaps, Data quality, Actions, Definitions, Settings

### 1.6 Phase 1 check before merging to `main`

- [x] Lint, typecheck and build pass
- [x] Every route checked at 375px with no sideways page scroll; staff pages spot-checked at 800px and 1280px
- [~] Accessibility checklist (`design.md` section 11): one `h1` and a unique title on every route verified; a full keyboard and screen reader pass is still to do
- [x] Search the codebase for banned patterns: gradients, `rounded-full` on buttons/inputs, emoji, em dashes (only the auto-generated Next.js block in `AGENTS.md` has em dashes)
- [x] Every portal page shows the "Sample data" notice (set once in the portal shells)
- [x] Merge to `main` (pull request 2, 3 Oct 2026)

### 1.8 Working sign-in (frontend only)

- [x] Trainee sign-in with mobile number and simulated SMS one-time password
- [x] Staff, employer and official sign-in with email and password
- [x] Prototype accounts panel; redirect to the right portal per role; sign-out
- [ ] Protect portals (redirect to sign-in when signed out): not yet, by team decision

### 1.7 Shared groundwork before splitting

- [x] Toast messages for success and error (`src/components/ui/toast.tsx`, provider in the root layout)
- [x] DataTable sorting (`sortValue`) and pagination (`pageSize`); shared outcome columns are sortable
- [x] Frontend-phase mock layer: `createMockStore`, `useMockStore`, `simulateRequest`, `ActionError`, "Reset sample data" (`architecture.md` section 11)
- [x] React Hook Form, Zod and resolvers installed and pinned, so no member needs to change `package.json` for forms
- [ ] Fill in M1, M2 and M3 names in `memory.md`
- [ ] Merge to `main`; each member creates their feature branch from it

## Phase 2: Shared foundation (together, on `main`, before splitting)

**On hold.** The team is building a frontend prototype first (`memory.md`, decision of 3 Oct 2026). Do not start any item below until the team agrees.

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
