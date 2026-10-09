# Revive: Architecture

Read `prd.md` first. This document explains how Revive is built and where code belongs. If code and this document disagree, fix one of them in the same pull request.

---

## 1. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) with React | One repo for UI and server code; server components keep trainee pages light |
| Language | TypeScript, `strict: true` | Shared domain types across all three stakeholder areas |
| Styling | Tailwind CSS v4, design tokens in `src/app/globals.css` (`@theme`) | Tokens defined in one place; no ad-hoc colours |
| UI primitives | shadcn/ui pattern: our own components in `src/components/ui`, built on Radix primitives (`radix-ui`) and `class-variance-authority`. The shadcn CLI is not used, so `globals.css` stays the only source of tokens | Accessible primitives that we own and can edit |
| Icons | `lucide-react` | Consistent line icons; no emoji |
| Charts | Recharts, wrapped in `src/components/charts` | Simple API; wrappers enforce our palette and the small-group rule |
| Tables | Our own `DataTable` in `src/components/ui/table.tsx`: sortable columns (`sortValue`) and optional pagination (`pageSize`), done in the browser | One small component instead of a table library |
| Forms | React Hook Form + Zod | One Zod schema validates both client and server |
| Database | PostgreSQL | Relational, longitudinal data; strong aggregate queries |
| ORM | Prisma | Typed queries, migrations |
| Background jobs | pg-boss (queue stored in Postgres) | Follow-up scheduling without adding Redis |
| Auth | Session-based. Phone OTP for trainees, email + password for staff and employers. Library chosen at the start of Phase 2 and recorded in `memory.md` | Different sign-in needs per role |
| Testing | Vitest (units), Playwright (smoke flows) | |
| Lint / format | ESLint (Next.js config) + Prettier | |
| Package manager | npm | Simplest for a 3-person team on Windows |
| Runtime | Node.js 24 LTS (pinned in `.nvmrc`) | |

Exact package versions are pinned in `package.json` at setup time and recorded in `memory.md`. Follow the conventions of the installed Next.js version (for example, in Next.js 15 and later, `params` and `searchParams` in pages are Promises and must be awaited).

## 2. System overview

```
                        Browser (trainee phone / staff desktop)
                                        |
                                    HTTPS only
                                        |
  +-------------------------------- Next.js app ---------------------------------+
  |  Public pages   Trainee   Agent   Provider   Employer   Gov (district/state) |
  |       |            |        |        |           |              |            |
  |       +------------+--------+---- Server actions / route handlers +          |
  |                              |                                               |
  |              Services layer (src/server/services)                            |
  |      consent | identity | outcomes | followups | verification | analytics    |
  |                              |                                               |
  |      Prisma (src/server/db)  |   Adapters (src/server/adapters)              |
  +------------------------------|-----------------------|------------------------+
                                 |                       |
                            PostgreSQL          SMS / WhatsApp / IVR,
                         (+ pg-boss queue)      EPFO, SIDH, GSTIN/Udyam
                                                (simulated in prototype)
                                 |
                         Worker process (same codebase, `npm run worker`)
                         runs scheduled follow-ups and escalations
```

### Request flow rules

1. Pages and components never call Prisma directly. They call a service.
2. Services check authorisation (role, district scope, consent) before reading or writing.
3. Services never call external systems directly. They call an adapter interface.
4. Every adapter has a `Simulated` implementation used in development and in the demo.

## 3. Folder structure

```
revive/
  prd.md  architecture.md  design.md  rules.md  tasks.md  memory.md  README.md
  AGENTS.md  CLAUDE.md            instructions for AI assistants (the Next.js block is auto-generated)
  prisma/                         (Phase 2)
    schema.prisma
    migrations/
    seed.ts
  src/
    app/
      layout.tsx                  root layout: font, metadata, title template
      globals.css                 Tailwind import + design tokens (@theme)
      icon.svg  favicon.ico  apple-icon.png    favicon set (Next.js file conventions)
      not-found.tsx
      (public)/                   SHARED
        layout.tsx                public header + footer (PublicFrame)
        page.tsx                  home
        how-it-works/page.tsx
        privacy/page.tsx
        terms/page.tsx
        contact/page.tsx
        accessibility/page.tsx
        login/page.tsx            sign-in tabs + prototype portal links
      trainee/                    M1
        layout.tsx                TraineeShell
        page.tsx                  home
        consent/page.tsx
        follow-ups/[followUpId]/page.tsx
        outcomes/new/page.tsx
        profile/page.tsx
      agent/                      M1
        layout.tsx                AppShell
        page.tsx                  work queue
        tasks/[taskId]/page.tsx   call screen
      provider/                   M2
        layout.tsx                AppShell
        page.tsx                  scorecard
        batches/page.tsx
        batches/[batchId]/page.tsx
        batches/upload/page.tsx
        placements/new/page.tsx
        actions/page.tsx
      employer/                   M2
        (portal)/                 signed-in pages, AppShell layout
          layout.tsx
          page.tsx                dashboard
          verifications/page.tsx
          hires/page.tsx
          feedback/page.tsx
        register/                 before sign-in, PublicFrame layout
          layout.tsx
          page.tsx
      gov/                        M3
        layout.tsx                AppShell
        page.tsx                  overview
        cohorts/page.tsx
        providers/page.tsx
        providers/[providerId]/page.tsx
        districts/page.tsx
        districts/[districtCode]/page.tsx
        demographics/page.tsx
        skill-gaps/page.tsx
        data-quality/page.tsx
        actions/page.tsx
        definitions/page.tsx
        settings/page.tsx
    components/                   SHARED
      ui/                         primitives: button, card, badge, field, input, select, choice,
                                  table + data-table-view (sorting, pagination), tabs, dialog,
                                  toast, stepper, breadcrumbs, empty-state
      layout/                     app-shell, trainee-shell, public-frame, public-header, public-footer,
                                  portal-nav, mobile-nav, page-header, long-form, logo, skip-link
      charts/                     chart-card, outcome-chart, chart-data, format-chart-value, palette, types
      domain/                     metric-tile, outcome-summary-tiles, outcome-columns, filter-bar,
                                  verification-badge, status-badge, remedial-action-list,
                                  sample-data-notice, reset-sample-data-button, draft-notice
    features/
      trainee/                    M1: components used only by trainee screens (consent-card)
      agent/                      M1
      provider/                   M2
      employer/                   M2
      gov/                        M3 (gov-filters, breakdown-table)
      auth/                       SHARED: prototype sign-in (demo accounts, session store,
                                  simulated one-time password, mock-api, sign-in forms)
      <area>/mock-api.ts          frontend phase: that area's stores and mock actions (section 11)
    lib/                          SHARED, pure functions only (no I/O)
      cn.ts                       className helper
      format.ts                   en-IN numbers, rupees, percentages, dates
      metrics.ts                  metric definitions, rates, small-group suppression
      consent.ts                  current consent state from consent events
      navigation.ts               sidebar items per portal
      constants.ts                labels, reason codes, verification levels, follow-up windows
    mocks/                        SHARED, Phase 1 sample data (replaced by the database in Phase 2)
      client-store.ts             createMockStore, useMockStore, resetAllMockStores
      simulate-request.ts         simulateRequest, ActionResult, ActionError
      reference.ts                districts, programmes, courses, providers, centres, employers
      synthetic-trainees.ts       seeded generator for about 2,600 synthetic trainee records
      aggregate.ts  analytics.ts  counts and grouped datasets built from those records
      trainee-portal.ts  agent-queue.ts  batches.ts  employer-portal.ts
      remedial-actions.ts  data-quality.ts
    types/
      domain.ts                   SHARED domain types
      analytics.ts                OutcomeCounts and other aggregate shapes
    server/                       (Phase 2)
      db/                         Prisma client
      auth/                       session, role guards
      services/                   one file per domain service
      adapters/                   messaging, epfo, sidh, business-registry (+ simulated/)
      jobs/                       pg-boss job handlers
```

Ownership labels (SHARED, M1, M2, M3) are binding. See `rules.md`, section 4.

## 4. Domain model

Phase 1 uses these as TypeScript types in `src/types/domain.ts` (aggregate shapes are in `src/types/analytics.ts`). Phase 2 turns them into a Prisma schema with the same names.

```
District (code, name)
Programme (id, code, name, followUpWindows[])
Course (id, qpCode, name, sector, nsqfLevel, programmeId)
Provider (id, name, registrationRef) 1--* Centre (id, providerId, districtCode, name)
Batch (id, courseId, centreId, startDate, endDate)

Trainee (id = Revive ID, fullName, dateOfBirth, gender, socialCategory,
         disability, residenceType, districtCode)
  1--* ExternalIdentifier (system: SIDH | PROGRAMME | UAN, value)
  1--* ContactPoint (type: PHONE | EMAIL | ALTERNATE, valueEncrypted, valueHash, status)
  1--* ConsentEvent (purpose, action: GRANT | WITHDRAW, noticeVersion, channel, actorId, at)
  1--* Enrolment (batchId, status, certifiedAt)

Enrolment 1--* FollowUpTask (window: W0 | W3 | W6 | W12 | W24, opensAt, closesAt,
                             status: SCHEDULED | SENT | RESPONDED | ESCALATED | UNREACHABLE | CLOSED)
FollowUpTask 1--* FollowUpAttempt (channel, result, agentId, notes, at)

Trainee 1--* OutcomeRecord (type: WAGE | SELF | APPRENTICE | STUDY | NOT_WORKING,
                            window, source, verificationLevel, employerId?, jobRole?,
                            monthlyWage?, wageBand?, startDate?, endDate?, reasonCode?,
                            relevanceScore?, evidenceFileId?, supersedesId?, createdAt)

Employer (id, legalName, gstin?, udyamNumber?, districtCode, verifiedAt?)
  1--* EmploymentVerification (outcomeRecordId, status: PENDING | CONFIRMED | CORRECTED | REJECTED,
                               respondedAt)
  1--* SkillGapFeedback (jobRole, skillCode, severity, comment)

RemedialAction (id, targetType: PROVIDER | COURSE | DISTRICT | COHORT, targetId, title,
                assigneeId, status: OPEN | IN_PROGRESS | DONE | DROPPED, dueDate, notes)

User (id, role: TRAINEE | AGENT | PROVIDER_STAFF | EMPLOYER | DISTRICT_OFFICER | STATE_ADMIN,
      providerId?, employerId?, districtCode?)
AuditLog (actorId, action, entityType, entityId, at, ip)
```

Rules built into the model:

- `OutcomeRecord` is never updated in place. A correction creates a new row with `supersedesId`.
- `ConsentEvent` is append-only. The current consent state is the latest event per purpose.
- Phone numbers are stored encrypted (`valueEncrypted`) with a keyed hash (`valueHash`) for lookup.
- No Aadhaar number column exists.

## 5. Access control

| Role | Can see | Cannot see |
| --- | --- | --- |
| TRAINEE | Own record only | Anyone else |
| AGENT | Assigned tasks; name and contact of those trainees while the task is open | Analytics, wages of other trainees |
| PROVIDER_STAFF | Own provider's batches, outcomes, scorecard | Other providers' trainee-level data; trainee phone numbers unless needed for a placement entry |
| EMPLOYER | Verification requests naming their business | Any trainee data not in a request |
| DISTRICT_OFFICER | Aggregates and records for their district | Other districts |
| STATE_ADMIN | All aggregates; trainee-level data only through audited drill-down | |

Enforcement happens in services (server side). Hiding a link in the UI is not access control.

## 6. Analytics

- Metric formulas live in `src/lib/metrics.ts` and match `prd.md` section 8 exactly. Dashboards import from there; no screen calculates a metric its own way.
- Aggregates are computed with SQL (`GROUP BY` over outcome views). Materialised views are added only if queries become slow.
- Small-group suppression (n < 10) is applied in the service layer before data reaches the browser, and again in the chart wrappers as a safety check.

## 7. Follow-up engine (Phase 2)

1. On certification, the system creates `FollowUpTask` rows for each window in the programme configuration.
2. A pg-boss cron job runs every 15 minutes, finds tasks whose `opensAt` has passed, and sends the first message through the messaging adapter.
3. Escalation steps (reminder, IVR, agent queue, alternate contact, unreachable) are separate jobs keyed by `taskId + step`. This makes them idempotent: re-running a job never sends twice.
4. A response from any channel (web link, IVR keypress, agent form) goes through the same `outcomes` service.

## 8. Adapters

| Adapter | Interface | Prototype implementation |
| --- | --- | --- |
| Messaging | `sendSms`, `sendWhatsApp`, `placeIvrCall` | Writes to a dev outbox table and the server log |
| EPFO | `verifyEmployment(uan, consentRef)` | Returns a deterministic result from seed data |
| SIDH | `fetchCandidate(sidhId)` | Reads from seed data |
| Business registry | `validateGstin`, `validateUdyam` | Format and checksum validation only |
| File storage | `putFile`, `getSignedUrl` | Local disk in development |

Any screen showing data from a simulated adapter says so.

## 9. Environments and deployment

| Environment | Purpose |
| --- | --- |
| Local | Each member: `npm run dev` with a local or Docker Postgres |
| Preview | One deployment per pull request (if the host supports it) |
| Production | Custom domain, HTTPS, database in an Indian region |

Secrets live in `.env.local` (never committed). `.env.example` lists every variable with a dummy value.

## 10. Phase 1 (UI only) constraints

In Phase 1 there is no database, no auth and no server code:

- Pages read typed sample data from `src/mocks`. Dashboard figures are aggregated from one seeded set of synthetic trainee records, so totals agree across pages.
- Rates are still calculated only through `src/lib/metrics.ts`, so the formulas carry over unchanged when real data arrives.
- Sign-in pages are static forms. The sign-in page lists every portal under "Prototype preview" so the team can open each one.
- In the merged UI shell, buttons have no handlers and forms do not submit. Filters are visual only. Each member adds frontend behaviour for their own area using section 11.
- `AppShell` and `TraineeShell` show the sample-data label ("Figures shown use sample data") on every portal page. Remove it from the shells when real data is connected.
- No `src/server` folder exists yet.

## 11. Frontend phase: simulating actions

Until the backend exists, actions such as "Withdraw consent", "Confirm employment" or "Create action" change sample data held in the browser. Everyone uses the same pattern, so Phase 2 only has to replace one layer.

**Shared pieces (do not copy them):**

| File | Purpose |
| --- | --- |
| `src/mocks/client-store.ts` | `createMockStore(name, initialData)` holds data that can change; `useMockStore(store)` reads it in a client component. Kept in `sessionStorage` for the tab, so changes survive page changes and reset when the tab closes |
| `src/mocks/simulate-request.ts` | `simulateRequest(fn)` runs a change after a short delay and returns `ActionResult` (`{ ok: true, data }` or `{ ok: false, error }`). Throw `ActionError("message")` for errors the user should see |
| `src/components/ui/toast.tsx` | `useToast().showToast("success" \| "error", message)` |
| "Reset sample data" in the sample-data notice | Puts every store back to its starting data, for demos |

**Each area owns one mock API file:** `src/features/<area>/mock-api.ts` (for example `src/features/employer/mock-api.ts`). It creates that area's stores and exports async functions named like the future server actions. Pages and components never change a store directly; they call these functions.

```ts
// src/features/employer/mock-api.ts
import { createMockStore } from "@/mocks/client-store";
import { ActionError, simulateRequest } from "@/mocks/simulate-request";
import { VERIFICATION_REQUESTS } from "@/mocks/employer-portal";

export const verificationRequestsStore = createMockStore("employer-verification-requests", VERIFICATION_REQUESTS);

export function confirmEmployment(requestId: string) {
  return simulateRequest(() => {
    const request = verificationRequestsStore.getState().find((item) => item.id === requestId);
    if (!request) throw new ActionError("This request no longer exists. Refresh the page.");
    verificationRequestsStore.setState((requests) =>
      requests.map((item) => (item.id === requestId ? { ...item, status: "CONFIRMED" } : item)),
    );
  });
}
```

```tsx
// A client component in src/features/employer/
const requests = useMockStore(verificationRequestsStore);
const { showToast } = useToast();
const [isPending, startTransition] = useTransition();

function handleConfirm(requestId: string) {
  startTransition(async () => {
    const result = await confirmEmployment(requestId);
    showToast(result.ok ? "success" : "error", result.ok ? "Employment confirmed." : result.error);
  });
}
```

Rules for this phase:

1. Parts of a page that show changeable data are client components that read `useMockStore`. The rest of the page stays a server component.
2. Forms use React Hook Form with a Zod schema. Keep each schema in the area's folder; Phase 2 reuses it to validate on the server.
3. Store names are unique and start with the area, e.g. `"trainee-consent-events"`.
4. Only store plain JSON data (no functions, dates as ISO strings).
5. In Phase 2, each `mock-api.ts` function is replaced by a server action with the same name, inputs and `ActionResult` output, and `useMockStore` reads are replaced by server data.
