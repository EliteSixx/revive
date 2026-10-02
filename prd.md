# Revive: Product Requirements Document

| Field | Value |
| --- | --- |
| Problem Statement ID | 26135 (Smart India Hackathon 2026) |
| Title | Difficulties in tracking employment outcomes, skill gaps, and the impact of skilling initiatives |
| Organisation | Government of Maharashtra |
| Department | Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation |
| Category / Theme | Software / Miscellaneous |
| Product name | Revive |
| Document status | v1.0, 2 Oct 2026 |

---

## 1. Summary

Revive is a longitudinal skilling-outcomes and impact-measurement system. It follows each trainee from enrolment through certification and then for 12 months or more afterwards. It records whether the trainee found wage employment, became self-employed, joined an apprenticeship, continued studying, or stayed unemployed, and why. Every outcome carries a verification level, so the state can tell a self-reported job from one confirmed by the employer or by EPFO records.

The output is credible, comparable outcome data. Departments can use it to compare providers and courses, find skill gaps, target remedial action and allocate funds based on evidence.

## 2. Problem

Training systems already capture enrolment, attendance, assessment and certification. The data stops at certification. After that:

1. **Contact is lost.** Trainees change phone numbers and move between districts.
2. **Employers do not report consistently.** Placement claims made by providers are hard to check.
3. **Identifiers and definitions differ across programmes.** The same person can appear under different IDs in different schemes, and "placed" means different things in different programmes.
4. **Outcomes beyond the first job are not tracked.** Retention, wage progression, self-employment and apprenticeship outcomes are mostly missing.

Without longitudinal outcomes it is not possible to compare providers, improve courses, target investment or demonstrate public value.

## 3. Background research (brief)

- The Maharashtra State Skill Development Society (MSSDS), set up in 2011, is the state nodal agency for planning, running and monitoring skilling schemes. State skilling schemes run through it. ([MSSDS Annual Report 2018](https://Kaushalya.mahaswayam.gov.in/MSSDS%20Annual%20Report%202018_Final.pdf))
- Among MSDE schemes, placement is tracked mainly under the Short Term Training component of PMKVY. In Maharashtra, across PMKVY 1.0 to 3.0, 80,950 of 2.60 lakh certified Short Term Training candidates were reported placed, a placement rate of 30.4%. ([Rajya Sabha answer, Feb 2024](https://rsdebate.nic.in/bitstream/123456789/747789/1/PQ_263_07022024_U605_p443_p445.pdf))
- Under PMKVY 2016-20, placement data had to be reported on SDMS within 90 days of certification. There was no standard tracking of retention at 6 or 12 months, or of wage progression. ([Rajya Sabha answer, Dec 2017](https://rsdebate.nic.in/bitstream/123456789/681935/2/PQ_244_20122017_U625_p309_p312.pdf))
- PMKVY 4.0 runs through the Skill India Digital Hub (SIDH), a national platform that links skilling, education, employment and entrepreneurship records.
- With the person's consent, their EPFO record under their UAN (Universal Account Number) can confirm employer names, joining and exit dates, and the monthly contribution pattern. This makes it a strong independent check on formal-sector employment. ([UAN-based verification overview](https://ongrid.in/blogs/?p=7760))
- The Digital Personal Data Protection Act, 2023 (DPDP Act) and its Rules require consent that is free, specific, informed and unambiguous, and that can be withdrawn as easily as it was given. Personal data must be limited to the stated purpose.

**Implications for design**

1. A 90-day placement check alone is not enough. Revive tracks at 3, 6 and 12 months by default.
2. Outcome data must show its source and verification level, not only the count.
3. Consent has to be granular (one record per purpose), logged, and revocable from the trainee's own screen.
4. Revive links to SIDH, EPFO and state portals through adapters. In the prototype these adapters are simulated, and this is labelled clearly.

## 4. Goals and non-goals

### Goals

| ID | Goal |
| --- | --- |
| G1 | Create a consent-based, deduplicated trainee record that links all of a person's enrolments across programmes. |
| G2 | Capture employment, self-employment, apprenticeship, further study and non-placement outcomes at fixed intervals after certification. |
| G3 | Keep follow-up low-burden: an automated follow-up takes under 2 minutes, has at most 6 questions, and works on a basic phone. |
| G4 | Attach a verification level to every outcome and validate the employers named in outcome reports. |
| G5 | Measure job retention and wage progression over time. |
| G6 | Provide analytics by cohort, course, provider, district and demographic group, using one published set of metric definitions. |
| G7 | Identify skill gaps and reasons for non-placement or attrition. |
| G8 | Let officials create and track remedial actions against providers, courses or cohorts. |
| G9 | Protect privacy by design: consent, data minimisation, role- and district-scoped access, audit logs, and suppression of small groups in analytics. |

### Non-goals (v1)

- A job portal or vacancy marketplace (existing portals such as Mahaswayam and NCS already do this).
- A Learning Management System, attendance system or assessment engine.
- Payments, stipend disbursal or provider billing.
- Live integration with government APIs in the hackathon prototype. Adapters are built and simulated.
- Languages other than English in v1. Marathi and Hindi are planned for later.
- Native mobile apps. The web app is responsive and the trainee screens are mobile-first.

## 5. Stakeholders and roles

| Role | Who | Main need | Owner in team |
| --- | --- | --- | --- |
| Trainee | Person enrolled in or completed a skilling course | Give consent, report outcomes quickly, update contact details, see their own record | M1 |
| Follow-up agent | Call-centre or field staff doing assisted follow-ups | Work queue of trainees who did not respond, scripted call form, attempt logging | M1 |
| Training provider | Training partner and centre staff | Upload batches, record placements with evidence, see their own outcome scorecard | M2 |
| Employer | Business that hired a trainee | Confirm or reject employment claims quickly, give skill-gap feedback | M2 |
| District officer | District Skill Development, Employment and Entrepreneurship Guidance Centre staff | Analytics and actions for their own district only | M3 |
| State admin | Department / MSSDS / MSInS officials | State-wide analytics, provider comparison, metric definitions, programme configuration, remedial actions | M3 |

Team split: **M1** owns Trainee and Follow-up agent. **M2** owns Training provider and Employer. **M3** owns District officer and State admin (Government). Shared code is owned jointly (see `rules.md`).

## 6. Core concepts

### 6.1 Trainee record and identity

- Each person gets one **Revive ID**.
- External identifiers (SIDH candidate ID, programme enrolment IDs, UAN where consented) are stored as linked identifiers, never as the primary key.
- Aadhaar numbers are **not stored**. If Aadhaar-based matching is approved later, only a salted hash or a reference token is kept.
- A trainee can have several contact points (primary phone, alternate phone, email, optional family contact with consent). Each contact point has a status: active, unreachable or retired.
- Deduplication: exact match on linked external IDs first, then on normalised name + date of birth + phone. Possible duplicates go to a manual merge queue. Records are never merged automatically on a fuzzy match.

### 6.2 Consent

Consent is recorded **per purpose**. Each purpose can be given or withdrawn separately.

| Purpose code | Meaning | Required? |
| --- | --- | --- |
| `OUTCOME_TRACKING` | Contact the trainee for follow-ups and store their responses | Required to take part in tracking |
| `EMPLOYER_VERIFICATION` | Contact the named employer to confirm employment | Optional |
| `EPFO_VERIFICATION` | Check employment through EPFO records using UAN | Optional |
| `ALTERNATE_CONTACT` | Use an alternate or family contact if the primary number fails | Optional |
| `ANALYTICS` | Include de-identified data in aggregate reports | Required to take part in tracking |

- Every grant and withdrawal is an append-only consent event with timestamp, channel, notice version and actor.
- When consent is withdrawn, the related processing stops from that point. Data already collected is kept or erased according to the published retention policy.
- The consent notice is short and written in plain language. The privacy policy page links to it.

### 6.3 Outcome types

| Outcome | Key fields |
| --- | --- |
| Wage employment | Employer, job role, start date, monthly gross wage (exact or band), employment type (full-time / part-time / contract), location (district) |
| Self-employment | Activity type, start date, monthly income band, Udyam registration (optional), loan availed (optional), number of people employed |
| Apprenticeship | Establishment, scheme (for example NAPS), start date, stipend, expected end date, completion status |
| Further study | Institution type, course level |
| Not working | Reason (from the fixed list in 6.5), actively looking (yes/no) |

Each outcome record has: `source` (trainee / provider / employer / agent / system), `verificationLevel`, `observedAt`, and the `followUpWindow` it belongs to.

### 6.4 Verification levels

Listed in increasing order of trust. The UI always shows the level as a text label, not as colour alone.

| Level | Meaning |
| --- | --- |
| `SELF_REPORTED` | Reported only by the trainee |
| `PROVIDER_REPORTED` | Reported by the training provider, with or without evidence |
| `EVIDENCE_ATTACHED` | Offer letter, payslip or similar document uploaded and reviewed |
| `EMPLOYER_CONFIRMED` | Employer confirmed the employment in Revive |
| `EPFO_VERIFIED` | Matched against EPFO records with the trainee's consent |

If two sources disagree, both are kept. The higher level wins for reporting, and the conflict appears in the data-quality view.

### 6.5 Reason taxonomies

**Non-placement reasons**: no job offer received; wage offered too low; job location too far / unwilling to migrate; skill or role mismatch; employer wanted experience; certificate not received; further study; family or caregiving responsibilities; health; started own work (moves to self-employment); other (free text, max 200 characters).

**Attrition reasons (left a job)**: wage too low; working conditions; distance or travel; contract ended; laid off; health; family; better opportunity; started own work; other.

These lists are versioned in configuration so that every programme uses the same codes.

### 6.6 Follow-up schedule

Default windows, measured from certification date (T0). State admin can configure them per programme.

| Window | Timing | Purpose |
| --- | --- | --- |
| W0 | T0 | Confirm contact details and consent, record any placement already made |
| W3 | T0 + 3 months | Placement status (matches the existing 90-day reporting practice) |
| W6 | T0 + 6 months | Retention and wage |
| W12 | T0 + 12 months | Retention, wage progression, course relevance |
| W24 (optional) | T0 + 24 months | Long-term livelihood |

**Escalation ladder per window:** SMS / WhatsApp link → reminder after 3 days → IVR call after 7 days → assisted call by follow-up agent after 10 days → alternate contact (if consented) → marked `UNREACHABLE` for that window. A window closes 30 days after it opens.

## 7. Functional requirements

Priority: **P0** is needed for the hackathon demo. **P1** should be built if time allows. **P2** is later.

### 7.1 Trainee (M1)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-T-01 | Sign in with phone number and one-time password (OTP). | P0 |
| FR-T-02 | View consent purposes in plain language; give or withdraw each purpose separately; view consent history. | P0 |
| FR-T-03 | Dashboard showing enrolments, certification, the next follow-up due date, and any pending follow-up. | P0 |
| FR-T-04 | Complete a follow-up form (max 6 questions, one per screen, works at 360 px width). The questions change based on the outcome type. | P0 |
| FR-T-05 | Report a new outcome at any time (new job, job change, started business, apprenticeship, not working with reason). | P0 |
| FR-T-06 | Update contact details. A new phone number is confirmed by OTP. | P0 |
| FR-T-07 | Optionally upload evidence (offer letter, payslip); image or PDF, max 5 MB. | P1 |
| FR-T-08 | Rate how relevant the training was to their current work (4-point scale). | P1 |
| FR-T-09 | Download a copy of their own data. | P2 |

### 7.2 Follow-up agent (M1)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-A-01 | Work queue of open follow-up tasks, filtered by district, window and number of attempts. | P0 |
| FR-A-02 | Call screen showing a scripted form that mirrors the trainee follow-up form, plus a consent re-confirmation step. | P0 |
| FR-A-03 | Log each attempt: channel, result (answered / no answer / wrong number / switched off / refused / callback requested), notes. | P0 |
| FR-A-04 | Mark a contact point as unreachable and switch to an alternate contact if consented. | P1 |
| FR-A-05 | Schedule a callback. | P1 |

### 7.3 Training provider (M2)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-P-01 | View their own batches with course, centre, dates, enrolled / certified counts. | P0 |
| FR-P-02 | Upload a batch roster by CSV using a published template; validation errors are shown per row before import. | P0 |
| FR-P-03 | Record a placement for a trainee with employer, role, wage, start date and optional evidence. | P0 |
| FR-P-04 | Provider scorecard: placement, retention, wage and response-rate metrics for their own batches, with verification breakdown. | P0 |
| FR-P-05 | See which trainees have pending or overdue follow-ups (no personal contact details shown unless the provider has a valid purpose). | P1 |
| FR-P-06 | View remedial actions assigned to them and respond to them. | P1 |

### 7.4 Employer (M2)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-E-01 | Register with business name, GSTIN or Udyam number, address and district, and a contact person. The format of the identifier is validated. | P0 |
| FR-E-02 | View pending employment verification requests and confirm, correct or reject each one. | P0 |
| FR-E-03 | Confirm whether the person is still employed at W6 and W12, and the current wage band. | P0 |
| FR-E-04 | Give skill-gap feedback on hires from a fixed skill list for the job role, plus an optional comment. | P1 |
| FR-E-05 | Bulk-confirm employment through CSV. | P2 |

### 7.5 Government: district officer and state admin (M3)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-G-01 | Overview: headline outcome metrics with sample size (n) and verification share, filtered by programme, period and district. | P0 |
| FR-G-02 | Cohort analysis: outcomes by certification month, shown across W3, W6 and W12. | P0 |
| FR-G-03 | Provider comparison table with sorting and filters; provider detail page. | P0 |
| FR-G-04 | District view: map or table of districts with key metrics; district detail page. A district officer sees only their own district. | P0 |
| FR-G-05 | Demographic breakdown: gender, age band, social category, persons with disability, rural/urban. | P0 |
| FR-G-06 | Skill-gap view: top non-placement and attrition reasons, employer-reported skill gaps by job role and sector. | P0 |
| FR-G-07 | Data-quality view: contactability, response rate per window, verification coverage, conflicting records, duplicate queue size. | P0 |
| FR-G-08 | Remedial actions: create, assign (to provider, district or course owner), track status, close with a note. | P1 |
| FR-G-09 | Metric definitions page listing every metric's formula, denominator and inclusion rules. | P0 |
| FR-G-10 | Programme configuration: follow-up windows, reason lists, consent notice version. | P1 |
| FR-G-11 | Export aggregate tables to CSV (with small-group suppression applied). | P1 |

### 7.6 Public site (shared)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-S-01 | Home page explaining what Revive does and who it is for, with role-based sign-in links. No invented statistics. | P0 |
| FR-S-02 | How it works page (consent, follow-ups, verification levels). | P0 |
| FR-S-03 | Privacy policy page. | P0 (launch blocker) |
| FR-S-04 | Terms and conditions page. | P0 (launch blocker) |
| FR-S-05 | Contact page. | P0 |
| FR-S-06 | Accessibility statement. | P1 |

## 8. Metric definitions (single source of truth)

All dashboards must use these definitions. They are also shown in the app at `/gov/definitions`.

| Metric | Formula | Notes |
| --- | --- | --- |
| Certified | Trainees with certification date in the period | Base cohort |
| Response rate (Wn) | Trainees with a completed follow-up in window n ÷ trainees whose window n has closed | Shown per window |
| Placement rate (W3) | Trainees in wage employment, self-employment or apprenticeship at W3 ÷ certified trainees whose W3 has closed | Unreachable trainees stay in the denominator. Shown with verification breakdown |
| Verified placement rate (W3) | Same as above, counting only `EMPLOYER_CONFIRMED` or `EPFO_VERIFIED` | The headline accountability metric |
| Retention (W6 / W12) | Trainees in work at both W3 and W6 (or W12) ÷ trainees in work at W3 | Any work counts (job change allowed). Unreachable at W6/W12 is counted as not retained and also reported separately |
| Same-employer retention | Trainees with the same employer at W3 and W6 ÷ trainees in wage employment at W3 | |
| Median wage at placement | Median monthly gross wage at first wage-employment outcome | Shown in ₹, Indian number format |
| Wage progression | Median of (wage at W12 − wage at W3) ÷ wage at W3, among trainees with wages at both | Shown as % |
| Self-employment share | Self-employed ÷ all in work | |
| Training relevance | Share answering "Mostly" or "Fully" to "Are you using skills from this training in your work?" | Among those in work |
| Contactability | Trainees reached in at least one window ÷ certified trainees | Data-quality metric |

**Small-group suppression:** any value based on fewer than 10 trainees is shown as "Fewer than 10" and left out of exports.

## 9. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Privacy | DPDP Act-aligned consent; data minimisation; phone numbers encrypted at rest; access scoped by role and district; every read of personal data by staff is written to an audit log. |
| Security | HTTPS only; secure, httpOnly session cookies; rate-limited OTP; server-side input validation on every request; no secrets in the repository. |
| Accessibility | WCAG 2.1 AA; GIGW 3.0 practices for Indian government websites; full keyboard use; visible focus; meaningful labels. |
| Performance | Trainee pages usable on a low-end Android phone over 3G: First Contentful Paint under 2.5 s on a throttled connection; trainee page JavaScript under 150 KB gzipped. |
| Responsiveness | Trainee screens mobile-first from 360 px. Staff screens desktop-first, usable down to 768 px. |
| Reliability | Follow-up jobs are idempotent and retried. A failed message never creates a duplicate task. |
| Auditability | Outcome edits are append-only versions; history is viewable. |
| Data residency | Production data hosted in India. |
| Language | English in v1. Strings are not built by concatenation, so translation can be added later. |

## 10. Demo success criteria (hackathon)

These are things the demo shows working, not invented results.

1. A trainee gives consent, completes a W3 follow-up on a phone-sized screen in under 2 minutes, and later withdraws one consent purpose.
2. A provider uploads a batch CSV with one invalid row; the error is shown and the valid rows are imported.
3. A provider-reported placement is confirmed by the employer, and its verification level changes in the government dashboard.
4. A follow-up agent works through a queue item, logs a "wrong number" attempt, and switches to an alternate contact.
5. A state admin filters the dashboard by district and course, opens a provider with low verified placement, and creates a remedial action.
6. A district officer cannot see other districts' data.
7. Any group with fewer than 10 trainees is suppressed.

All demo data is synthetic and labelled "Sample data" in the UI.

## 11. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Low response rates | Short forms, several channels, escalation ladder, assisted calls, reminder timing set per programme |
| Providers inflating placements | Verification levels; the headline metric counts only employer- or EPFO-verified placements |
| Phone number churn | Multiple contact points, OTP-confirmed self-update, alternate contact with consent |
| Misleading comparisons between providers | Show n and verification share next to every rate; compare within the same sector and district; suppress small groups |
| Privacy breach | Encryption, least-privilege roles, audit logs, no Aadhaar storage, no personal data in URLs |
| No real API access during the hackathon | Adapter interfaces with simulated implementations, clearly labelled |

## 12. Launch blockers

Revive does not launch until all of these are done (see `rules.md`, section B):

- [ ] Custom domain connected
- [ ] Favicon added
- [ ] Any "Made with AI" or builder badge removed
- [ ] Privacy policy page live
- [ ] Terms and conditions page live
