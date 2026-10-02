# Revive: Project Memory

Shared memory for the team and for AI assistants. Read this first in every session. Keep entries short and dated. Newest log entries go at the top of the log.

---

## 1. Snapshot

| Item | Value |
| --- | --- |
| Project | Revive, SIH 2026, Problem Statement 26135 |
| Client | Government of Maharashtra, Department of Skills, Employment, Entrepreneurship and Innovation (Maharashtra State Innovation Society) |
| Current phase | Phase 0 done (documentation). Phase 1 (UI shell) not started |
| Current branch | `feature/sinu` |
| Next step | Team reviews the docs, then Phase 1 UI shell is built and merged to `main` |

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

## 4. Open questions

| # | Question | Owner | Status |
| --- | --- | --- | --- |
| 1 | Which auth library (decide at start of Phase 2)? | All | Open |
| 2 | Hosting provider and custom domain name? | All | Open |
| 3 | Which real programme to model the demo on (PMKVY Short Term Training, a state MSSDS scheme, or both)? | All | Open |
| 4 | Final wording of privacy policy and terms (needs team review) | All | Open |
| 5 | Fill in team member names for M1, M2, M3 | All | Open |

## 5. Installed versions

To be recorded during Phase 1 setup (Node, Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Table, lucide-react).

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

### 2 Oct 2026

- Brief research done on outcome tracking in Indian skilling programmes (PMKVY placement reporting, MSSDS role, SIDH, EPFO/UAN verification, DPDP Act). Sources are listed in `prd.md` section 3.
- Q&A with the team lead settled stack, work split, language and visual tone (see Decisions).
- Created `prd.md`, `architecture.md`, `design.md`, `rules.md`, `tasks.md`, `memory.md`.
- No application code written yet.
