# Revive: Design System

Revive is a public-sector tool used by trainees on basic phones and by officials making funding decisions. The design has to look trustworthy, plain and precise: closer to a well-made government service than a startup landing page. If a design choice draws attention to itself rather than to the data, remove it.

Tokens below are the only allowed values. If a new value is needed, add it here first, then to `src/app/globals.css`.

---

## 1. Principles

1. **Data first.** Numbers, labels and status are the interface. Decoration is minimal.
2. **Every number has context.** A rate always shows its base (n), its period, and how much of it is verified.
3. **Plain language.** Write for a trainee who finished Class 10 and an officer reading 40 providers in a row.
4. **Never colour alone.** Status always has a text label, and an icon where useful.
5. **Mobile-first for trainees, desktop-first for staff.**
6. **Honest states.** Empty, loading, error and "Sample data" are designed states, not afterthoughts.

## 2. Banned patterns

These must never appear anywhere in Revive:

- Purple or any gradient backgrounds, gradient text, gradient buttons
- Pill-shaped (fully rounded) buttons or inputs
- Emoji used as icons or decoration
- Em dashes in any copy
- Fake reviews, testimonials, customer logos, user counters or invented metrics
- Vague hero text ("Empowering the future of skilling", "Unlock your potential", "Seamless", "Revolutionary")
- AI-generated photos or illustrations, stock photos of smiling people at laptops
- Custom cursors, cursor-follow effects, parallax, scroll-jacking, elements that fly in on scroll
- Glassmorphism, neon glows, heavy drop shadows, 3D blobs
- "Made with AI" or builder badges
- Official government emblems or logos (we are not authorised to use them)

## 3. Colour tokens

Light theme only in v1.

### Neutrals and surfaces

| Token | Hex | Use |
| --- | --- | --- |
| `--color-page` | `#F6F7F9` | Page background behind cards (staff portals) |
| `--color-surface` | `#FFFFFF` | Cards, tables, forms, public pages |
| `--color-surface-muted` | `#F0F2F5` | Table header, subtle fills, read-only fields |
| `--color-border` | `#D9DDE3` | Card and table borders, dividers |
| `--color-border-strong` | `#B8BFC9` | Input borders |
| `--color-text` | `#16191F` | Body and headings |
| `--color-text-muted` | `#545B67` | Secondary text, captions, helper text |
| `--color-text-subtle` | `#6B7280` | Placeholders, disabled text (never for essential info) |

### Brand and status

| Token | Hex | Use |
| --- | --- | --- |
| `--color-primary` | `#1F4E8C` | Primary buttons, links, active nav, focus ring |
| `--color-primary-hover` | `#183E70` | Hover state of primary |
| `--color-primary-subtle` | `#E8EEF7` | Selected row, active nav background |
| `--color-success` | `#1E7A46` | Verified, completed |
| `--color-success-subtle` | `#E7F3EC` | |
| `--color-warning` | `#9A5B00` | Pending, needs attention |
| `--color-warning-subtle` | `#FBF1E2` | |
| `--color-danger` | `#B42318` | Errors, destructive actions, withdrawn consent |
| `--color-danger-subtle` | `#FBEAE8` | |
| `--color-info-subtle` | `#EEF2F7` | Notices such as "Sample data" |

All text/background pairs used together must meet WCAG 2.1 AA contrast (4.5:1 for body text, 3:1 for large text and UI boundaries). Check new pairs before adding them.

### Chart palette

Categorical (colour-blind safe, based on the Okabe-Ito set). Use in this order, and never more than 6 series in one chart:

| Order | Hex |
| --- | --- |
| 1 | `#0072B2` |
| 2 | `#E69F00` |
| 3 | `#009E73` |
| 4 | `#D55E00` |
| 5 | `#56B4E9` |
| 6 | `#CC79A7` |

Sequential (single metric across districts or months): `#DCE6F2` → `#A9C1E0` → `#6B93C6` → `#1F4E8C` → `#12305A`.

Colours 2, 5 and 6 and the two lightest sequential steps are below 3:1 contrast against white. Any chart using them must also show direct value labels or a legend with values, and every chart has the "View as table" option (WCAG 1.4.11).

Verification levels always use the same colours in charts. Each is at least 3:1 against white, and stacked segments are separated by a 1px white gap:

| Level | Colour |
| --- | --- |
| EPFO verified | `#1E7A46` |
| Employer confirmed | `#00808A` |
| Evidence attached | `#1F4E8C` |
| Provider reported | `#9A5B00` |
| Self reported | `#6B7280` |

## 4. Typography

- **Typeface:** Noto Sans (loaded with `next/font/google`), with a system sans-serif fallback. Chosen because it reads well at small sizes and has a Devanagari companion for the later Marathi/Hindi release.
- **Numbers in tables and metric tiles:** `font-variant-numeric: tabular-nums` so columns line up. Check during setup that the loaded font renders tabular figures.
- **Weights:** 400 regular, 500 medium, 600 semibold. No 700+ except the logotype.

| Token | Size / line height | Weight | Use |
| --- | --- | --- | --- |
| `text-display` | 32 / 40 | 600 | Public home page title only |
| `text-h1` | 24 / 32 | 600 | Page title |
| `text-h2` | 20 / 28 | 600 | Section title |
| `text-h3` | 16 / 24 | 600 | Card title |
| `text-body` | 15 / 24 | 400 | Default text |
| `text-small` | 13 / 20 | 400 | Helper text, table secondary text |
| `text-metric` | 28 / 36 | 600 | Metric tile value |
| `text-label` | 13 / 20 | 500 | Form labels, table headers |

Trainee screens use a minimum body size of 16px for readability on phones.

## 5. Spacing, radius, elevation, layout

- **Spacing scale (px):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Use Tailwind's default scale which matches these.
- **Radius:** `--radius-sm` 4px (buttons, inputs, badges, checkboxes), `--radius-md` 6px (cards, dialogs, tables). Nothing rounder. No `rounded-full` on buttons or inputs (allowed only for avatars and status dots).
- **Elevation:** borders, not shadows. Cards use a 1px `--color-border`. Only dialogs and dropdown menus get a shadow: `0 4px 16px rgba(22, 25, 31, 0.12)`.
- **Max content width:** 1280px for staff portals, 720px for trainee screens and long-form public pages (privacy, terms).
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).

### Page layouts

**Public pages:** header (logotype left, links right, "Sign in" button) → content → footer (links to Privacy, Terms, Accessibility, Contact; project disclaimer).

**Staff portals (agent, provider, employer, gov):**

```
+--------------------------------------------------------------+
| Top bar: Revive | portal name | district/provider scope | user |
+------------+-------------------------------------------------+
| Sidebar    | Page header: title, short description, actions  |
| 240px      |-------------------------------------------------|
| nav items  | Filter bar (when relevant)                      |
| with icons | Content: metric tiles, tables, charts           |
|            |                                                 |
+------------+-------------------------------------------------+
```

Below 1024px the sidebar collapses into a menu button in the top bar.

**Trainee portal:** single column, top bar with logotype and menu, large tap targets (min 44 × 44 px), one question per screen in follow-up forms, sticky bottom action bar for "Continue".

## 6. Components

All shared components live in `src/components`. Feature folders must not create their own versions.

| Component | Rules |
| --- | --- |
| **Button** | Variants: `primary` (filled primary), `secondary` (white, border), `ghost` (text only), `danger`. Sizes: `sm` 32px, `md` 40px, `lg` 48px (trainee). Radius 4px. Label is a verb ("Save placement", not "Submit"). Loading state disables and shows a spinner with the label kept. |
| **Input / Select / Textarea** | Label always visible above the field (no placeholder-as-label). Helper text below. Error text in danger colour with an icon, linked through `aria-describedby`. Height 40px (48px on trainee screens). |
| **Checkbox / Radio** | Whole row is clickable. Radio groups for 2 to 6 options; Select for more. |
| **Card** | White surface, 1px border, radius 6px, 20px or 24px padding. Optional header with title and one action. |
| **MetricTile** | Label, value (`text-metric`, tabular), base line ("n = 1,240 certified"), and verification share where relevant ("62% employer or EPFO verified"). Shows "Fewer than 10" when suppressed. No arrows or trend colours unless a comparison period is defined. |
| **DataTable** | Header in `--color-surface-muted`, 13px medium labels. Numbers right-aligned and tabular. Row height 44px. Sticky header on long tables. Sorting shown with an icon and `aria-sort`. Pagination at the bottom with total count. |
| **VerificationBadge** | Text label plus small icon, e.g. "Employer confirmed". Colours from section 3. Square-ish (radius 4px), never a pill. |
| **StatusBadge** | For follow-up and action status (Scheduled, Sent, Responded, Unreachable, Open, Done). Text always visible. |
| **ChartCard** | Card with title, one-line description of what is plotted, the chart, and a "View as table" toggle for accessibility. Axis labels and units always shown. |
| **FilterBar** | Programme, period, district, course, provider, demographic filters. Shows active filters as removable chips (radius 4px). "Clear all" link. |
| **PageHeader** | Title (h1), one-sentence description, optional actions on the right, optional breadcrumbs above. |
| **EmptyState** | Short title, one sentence explaining why it is empty and what to do, one action. No illustrations. |
| **SampleDataNotice** | Small info bar at the top of any page using mock data: "Sample data. These figures are synthetic and for demonstration only." |
| **ConsentCard** | Purpose title, plain-language explanation (2 sentences max), required/optional label, current state, toggle or button, last changed date. |
| **Stepper** | For trainee follow-up: "Question 2 of 5" text plus a thin progress bar. |
| **Dialog** | Used for confirmations only. Destructive confirm button uses `danger`. |
| **Toast** | Bottom-right on desktop, bottom on mobile. Success and error only. Auto-dismiss after 5 seconds; errors stay until dismissed. |

## 7. Icons

- `lucide-react` only. Size 16px inline with text, 20px in navigation and buttons. Stroke width default.
- Icons support labels; they never replace them, except for universally understood controls with an `aria-label` (close, menu).

## 8. Copy rules

- Sentence case for headings, buttons and labels ("Record a placement", not "Record A Placement").
- No em dashes. Use a full stop, comma, colon or brackets instead.
- Short sentences. Active voice. Say exactly what happens: "We will send you an SMS at 3, 6 and 12 months after your certificate."
- Numbers use Indian grouping (`en-IN`): 1,23,456. Currency: ₹18,500. Percentages: one decimal place in tables (30.4%), whole numbers in tiles if n > 1,000.
- Dates: `2 Oct 2026`. Months in charts: `Oct 2026`.
- Use "trainee" (not candidate, student, user) and "training provider" (not partner, vendor) consistently.
- No claims about impact, scale or users that are not backed by real data.
- Error messages say what went wrong and how to fix it: "Enter a 10-digit mobile number", not "Invalid input".

## 9. Logo and favicon

- Logotype: the word "Revive" set in Noto Sans semibold in `--color-text`, with a small square mark in `--color-primary` to its left. No tagline.
- Favicon: the square mark as `public/favicon.svg`, plus `favicon.ico` (32px) and `apple-touch-icon.png` (180px).
- Footer disclaimer on every public page: "Revive is a prototype built for Smart India Hackathon 2026 (Problem Statement 26135). It is not an official Government of Maharashtra website."

## 10. Page inventory (Phase 1 UI shell)

| Area | Page | Key content |
| --- | --- | --- |
| Public | Home | One clear sentence on what Revive does; four role cards (Trainee, Training provider, Employer, Government) linking to sign-in; "How tracking works" in three steps; consent and privacy summary |
| Public | How it works | Follow-up schedule, verification levels, what data is collected and why |
| Public | Privacy policy | Full policy page (launch blocker) |
| Public | Terms and conditions | Full terms page (launch blocker) |
| Public | Accessibility, Contact | Statement; contact form or address |
| Public | Sign in | Role tabs: trainee (phone + OTP), staff/employer (email + password) |
| Trainee (M1) | Dashboard, Consent, Follow-up form, Report outcome, Profile | See PRD 7.1 |
| Agent (M1) | Work queue, Call screen | See PRD 7.2 |
| Provider (M2) | Scorecard, Batches, Batch detail, Upload roster, Record placement, Actions | See PRD 7.3 |
| Employer (M2) | Dashboard, Verifications, Hires, Skill feedback, Register | See PRD 7.4 |
| Gov (M3) | Overview, Cohorts, Providers, Provider detail, Districts, District detail, Demographics, Skill gaps, Data quality, Actions, Definitions, Settings | See PRD 7.5 |

## 11. Accessibility checklist (every page)

- [ ] One `h1`; headings in order
- [ ] Every input has a visible label
- [ ] Focus ring visible on every interactive element (2px `--color-primary`, 2px offset)
- [ ] All actions reachable by keyboard; no keyboard traps
- [ ] Colour is never the only signal
- [ ] Charts have a table alternative
- [ ] Images have `alt`; decorative images have `alt=""`
- [ ] `prefers-reduced-motion` respected (we only use 150ms colour/opacity transitions anyway)
- [ ] Page has a unique `<title>`: "Page name | Revive"

## 12. Motion

Only 150ms transitions on colour, background and opacity for hover and focus, and a 200ms fade for dialogs and toasts. Nothing animates on scroll. Nothing moves with the cursor.
