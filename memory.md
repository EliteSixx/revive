# Revive: Project Memory

Shared memory for the team and for AI assistants. Read this first in every session. Keep entries short and dated. Newest log entries go at the top of the log.

---

## 1. Snapshot

| Item | Value |
| --- | --- |
| Project | Revive, SIH 2026, Problem Statement 26135 |
| Client | Government of Maharashtra, Department of Skills, Employment, Entrepreneurship and Innovation (Maharashtra State Innovation Society) |
| Current phase | Phase 1 UI shell merged to `main` (pull request 2). Shared groundwork (1.7) built on `feature/sinu` |
| Current branch | `feature/sinu` |
| Next step | Merge the shared groundwork to `main`, then each member branches by stakeholder and builds their area's frontend behaviour with the mock layer. Frontend only: no backend work until the team decides to start Phase 2 |

## 2. Team

| Slot | Name | Area | Branch |
| --- | --- | --- | --- |
| M1 | TBD | Trainee + Follow-up agent | `feature/<name>-trainee` |
| M2 | TBD | Training provider + Employer | `feature/<name>-provider` |
| M3 | TBD | Government (district officer + state admin) | `feature/<name>-gov` |

## 3. Decisions

| Date | Decision | Reason |
| --- | --- | --- |
| 2 Oct 2026 | Product name is **Revive** | Matches repository name |
| 2 Oct 2026 | Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + PostgreSQL + Prisma | One repo, fewest moving parts for 3 people; relational data suits longitudinal tracking |
| 2 Oct 2026 | Work split by stakeholder: M1 Trainee + Agent, M2 Provider + Employer, M3 Government | Keeps each member inside their own route and feature folders |
| 2 Oct 2026 | Follow-up agent belongs to M1 | Agent screens reuse the trainee follow-up form and the follow-up engine |
| 2 Oct 2026 | Deduplication / merge queue belongs to M2 | Provider roster upload is where most trainee identities enter the system |
| 2 Oct 2026 | English only in v1; no i18n library yet | Team choice. Strings must not be built by concatenation, so translation can be added later |
| 2 Oct 2026 | Visual tone: civic and sober, light theme only, single deep-blue accent `#1F4E8C`, Noto Sans | Trust and readability for a government audience |
| 2 Oct 2026 | Default follow-up windows: W0, W3, W6, W12 (W24 optional) after certification | Matches existing 90-day placement practice and adds retention and wage progression |
| 2 Oct 2026 | Headline accountability metric is **verified** placement rate (employer-confirmed or EPFO-verified only) | Stops provider-reported placements from inflating results |
| 2 Oct 2026 | Small-group suppression threshold n < 10 | Privacy in demographic and district breakdowns |
| 2 Oct 2026 | Aadhaar numbers are never stored | Data minimisation under the DPDP Act |
| 2 Oct 2026 | External integrations (SMS, WhatsApp, IVR, EPFO, SIDH, GSTIN/Udyam) are adapters with simulated implementations in the prototype | No real API access during the hackathon; labelled in the UI |
| 2 Oct 2026 | No official government emblems or logos; footer carries a prototype disclaimer | Not authorised to use them; avoids misleading users |
| 2 Oct 2026 | Phase 1 is UI only, built on one branch and merged to `main` before the split | Minimises UI conflicts between the three branches |
| 3 Oct 2026 | **Frontend prototype only for now.** No backend: no database, auth, API routes, server actions or `src/server`. Every screen reads sample data from `src/mocks`. Phase 2 (backend) starts only when the team says so | The current goal is to show a frontend prototype |
| 3 Oct 2026 | Stakeholder pages stay as UI shells: no form submits, buttons have no handlers, filters are visual only | Each member builds their own stakeholder's frontend behaviour in their own branch |
| 3 Oct 2026 | shadcn/ui pattern without the CLI: own components on `radix-ui` + `class-variance-authority` | The CLI would overwrite our tokens in `globals.css` |
| 3 Oct 2026 | TanStack Table dropped; own static `DataTable` | Latest TanStack Table is a new major version (v9); a small table is enough for Phase 1 |
| 3 Oct 2026 | Tailwind default colours, radii, shadows and font sizes are reset in `globals.css`; colour tokens are named `fg`, `fg-muted`, `fg-subtle` for text | Only design tokens can be used; `text-fg` reads better than `text-text` |
| 3 Oct 2026 | Dashboard sample data comes from a seeded generator (`src/mocks/synthetic-trainees.ts`, about 2,600 synthetic trainees, seed 26135) | Totals agree across every page; Phase 2 seed script can reuse it |
| 3 Oct 2026 | Small-group suppression also hides counts and base lines ("n = ..."), not only rates | A visible base of 8 would reveal a suppressed group |
| 3 Oct 2026 | The "Sample data" notice lives in `AppShell` and `TraineeShell` | Shown on every portal page; removed in one place later |
| 3 Oct 2026 | Frontend actions go through `src/features/<area>/mock-api.ts`, using the shared `createMockStore` and `simulateRequest` (`architecture.md` section 11) | One pattern for all three areas; Phase 2 swaps only this layer for server actions |
| 3 Oct 2026 | Sample data changes are kept in `sessionStorage` per browser tab, with a "Reset sample data" button | Changes survive page changes during a demo and are easy to undo |
| 3 Oct 2026 | Toast provider lives in the root layout; one shared `useToast` | Avoids three competing toast components |
| 3 Oct 2026 | Table sorting and pagination happen in the browser inside `DataTable`; suppressed values always sort last | Works with sample data now; server-side paging can replace it in Phase 2 |
| 3 Oct 2026 | Programme names in sample data are generic ("Central short-term training (sample)"); provider and employer names are invented | Avoids presenting real schemes or organisations with fake figures |

## 4. Open questions

| # | Question | Owner | Status |
| --- | --- | --- | --- |
| 1 | Which auth library (decide at start of Phase 2)? | All | Open |
| 2 | Hosting provider and custom domain name? | All | Open |
| 3 | Which real programme to model the demo on (PMKVY Short Term Training, a state MSSDS scheme, or both)? | All | Open |
| 4 | Final wording of privacy policy and terms (needs team review) | All | Open |
| 5 | Fill in team member names for M1, M2, M3 | All | Open |
| 6 | Team contact email for the Contact page (`TODO(copy)` in `src/app/(public)/contact/page.tsx`) | All | Open |
| 7 | When to start Phase 2 (backend) | All | Open: frontend prototype first |

## 5. Installed versions

Exact versions are pinned in `package.json`. Recorded 3 Oct 2026.

| Package | Version |
| --- | --- |
| Node.js | 24.19.0 (npm 11.17.0) |
| next | 16.3.8 (Turbopack is the default bundler) |
| react, react-dom | 19.2.8 |
| typescript | 5.9.3 |
| tailwindcss, @tailwindcss/postcss | 4.3.3 |
| radix-ui | 1.6.7 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| tailwind-merge | 3.7.0 |
| lucide-react | 1.50.0 |
| recharts | 3.10.1 |
| eslint | 9.39.5 (eslint-config-next 16.3.8) |
| prettier | 3.9.9 (prettier-plugin-tailwindcss 0.8.1) |
| react-hook-form | 7.89.0 |
| zod | 4.6.5 |
| @hookform/resolvers | 5.9.1 |

Notes for this Next.js version:
- `params` and `searchParams` are Promises; type pages with the global `PageProps<"/route/[id]">` helper.
- `npm run typecheck` runs `next typegen` first so those route types exist.
- `next lint` no longer exists; `npm run lint` runs ESLint directly.
- Middleware is now called `proxy` (relevant in Phase 2).
- Bundled docs: `node_modules/next/dist/docs/`.

## 6. Glossary

| Term | Meaning |
| --- | --- |
| Trainee | A person enrolled in or completed a skilling course |
| Training provider | Organisation running training centres and batches |
| Batch | A group of trainees taking one course at one centre with the same dates |
| Cohort | Trainees grouped by certification month (or another chosen period) |
| T0 | Certification date; follow-up windows are counted from here |
| W3 / W6 / W12 | Follow-up windows at 3, 6 and 12 months after T0 |
| Verification level | How strongly an outcome is confirmed: self reported, provider reported, evidence attached, employer confirmed, EPFO verified |
| Retention | Still in work at W6 or W12 among those in work at W3 |
| Suppression | Hiding any value based on fewer than 10 trainees |
| SIDH | Skill India Digital Hub, the national skilling platform |
| UAN | Universal Account Number, the EPFO member ID |
| EPFO | Employees' Provident Fund Organisation |
| NAPS | National Apprenticeship Promotion Scheme |
| QP | Qualification Pack, the code that defines a job role / course |
| DPDP Act | Digital Personal Data Protection Act, 2023 |
| MSSDS | Maharashtra State Skill Development Society |
| MSInS | Maharashtra State Innovation Society |

## 7. Log

### 3 Oct 2026 (later)

- Phase 1 UI shell merged to `main` through pull request 2.
- Built the shared groundwork on `feature/sinu`: toast, table sorting and pagination, the frontend mock layer, and form libraries. See `tasks.md` 1.7.
- No stakeholder features and no backend were added.

### 3 Oct 2026

- Synced `feature/sinu` with `main` (fast-forward to the merge of the docs pull request).
- Built the Phase 1 frontend UI shell: 37 routes across public pages and the trainee, follow-up desk, provider, employer and government portals. See `tasks.md` Phase 1.
- Frontend only, as agreed: no backend, no stakeholder features. Forms and buttons are static.
- Checks: lint, typecheck and production build pass; every route has no sideways scroll at 375px and has one `h1` and a unique title; banned-pattern search is clean.
- Still to do before merging: full keyboard and screen reader pass, team review of privacy and terms text, team contact email.

### 2 Oct 2026

- Brief research done on outcome tracking in Indian skilling programmes (PMKVY placement reporting, MSSDS role, SIDH, EPFO/UAN verification, DPDP Act). Sources are listed in `prd.md` section 3.
- Q&A with the team lead settled stack, work split, language and visual tone (see Decisions).
- Created `prd.md`, `architecture.md`, `design.md`, `rules.md`, `tasks.md`, `memory.md`.
- No application code written yet.
