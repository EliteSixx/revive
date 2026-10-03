# Revive: Project Rules

These rules apply to every member and every AI assistant working on this repository. When a rule here conflicts with a habit or a default, the rule wins. When this file conflicts with `prd.md`, `architecture.md` or `design.md`, stop and ask the team before changing code.

---

## A. Not vibe coded

The product must look and read like it was designed on purpose. Never use:

1. Purple gradients (or any gradient backgrounds, text or buttons)
2. Pill-shaped buttons or inputs
3. Fake reviews or testimonials
4. Fake metrics or invented statistics
5. Vague hero text
6. Emoji icons
7. Em dashes
8. Exaggerated scroll animations

The full banned list is in `design.md`, section 2.

## B. Launch blockers

Revive is not launched (shared publicly, submitted as a live link, or demoed on a public URL) until all of these are true:

- [ ] Custom domain connected, with HTTPS
- [ ] Favicon added (`src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`)
- [ ] Any "Made with AI", "Built with ..." or hosting/builder badge removed
- [ ] Privacy policy page live and linked from the footer
- [ ] Terms and conditions page live and linked from the footer

## C. Content we never use

1. AI-generated ("slop") photos or illustrations
2. AI-sounding filler copy ("In today's fast-paced world", "seamless", "revolutionise", "unlock", "empower", "cutting-edge", "leverage")
3. Custom cursor effects or cursor animations
4. Fake customer, user or placement counters

Sample data is allowed **only** inside portals, only while features are unbuilt, and only with the "Sample data" notice visible.

## D. Make no mistake

- Read the relevant section of `prd.md`, `architecture.md` and `design.md` before writing code.
- Run `npm run lint`, `npm run typecheck` and `npm run build` before every push. Do not push a broken build.
- Test the change in the browser at 360px and 1280px widths before opening a pull request.
- If a requirement is unclear, ask in the team chat. Do not guess and do not invent requirements.
- Record any new decision in `memory.md`.

---

## 1. General principles

1. Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before making changes.
2. Keep the code clean, readable and well-structured.
3. Prioritise simplicity and maintainability.
4. Do not duplicate logic. Reuse existing components, utilities or services.
5. Make small, focused changes instead of large, risky edits.
6. Do not modify unrelated files.
7. Write self-explanatory code with meaningful variable and function names.

## 2. Code conventions

### TypeScript

- `strict: true`. No `any`; use `unknown` and narrow it. No `// @ts-ignore`; if unavoidable, use `// @ts-expect-error` with a reason.
- Domain types come from `src/types/domain.ts`. Do not redefine `Trainee`, `OutcomeRecord`, etc. in feature folders.
- Prefer type unions of string literals for enums (`type VerificationLevel = "SELF_REPORTED" | ...`), with the list of values exported from `src/lib/constants.ts`.

### Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Files and folders | kebab-case | `metric-tile.tsx`, `skill-gaps/` |
| React components | PascalCase | `MetricTile` |
| Functions, variables | camelCase, verb-first for functions | `formatRupees`, `calculatePlacementRate` |
| Constants | UPPER_SNAKE_CASE | `SMALL_GROUP_THRESHOLD` |
| Booleans | `is`, `has`, `can`, `should` prefix | `isSuppressed`, `hasConsent` |
| Route segments | kebab-case nouns | `/gov/data-quality` |

### React and Next.js

- Server components by default. Add `"use client"` only for interactivity (forms, toggles, charts), and keep client components as small leaves.
- One component per file. Keep files under about 200 lines; split when larger.
- No inline `style={{}}` except for values computed at runtime (for example, chart dimensions).
- Use the `cn()` helper from `src/lib/cn.ts` for conditional classes.
- Use Tailwind classes that map to design tokens (`bg-surface`, `text-fg-muted`, `border-border`). Never write raw hex values in components.
- Use `next/link` for internal links and `next/image` for images.
- Every page exports `metadata` with a title in the form "Page name | Revive".
- Follow the conventions of the installed Next.js version (for example, `params` and `searchParams` are Promises in Next.js 15 and later).

### Changing data in the frontend phase

- Change sample data only through your area's `src/features/<area>/mock-api.ts` functions (`architecture.md` section 11). Never call `setState` on a store from a page or component.
- Show the result of every action with `useToast`, and disable the button while the action runs.
- Do not add a second store, request helper or toast. Use the shared ones.

### Formatting values

- Always use the helpers in `src/lib/format.ts` for numbers, currency, percentages and dates (`en-IN` locale). Do not call `toLocaleString` directly in components.
- Always use `src/lib/metrics.ts` to calculate or suppress metrics. Do not calculate a rate inside a component.

### Comments

- Code should explain itself. Comment only the "why" (a business rule, a legal constraint, a workaround), not the "what".
- No commented-out code in commits.

## 3. Privacy and security rules

1. Never put personal data (names, phone numbers, IDs) in URLs, query strings, logs or analytics events. Use opaque IDs.
2. Never store Aadhaar numbers.
3. Never commit secrets, `.env` files, real trainee data or real phone numbers. Sample data uses obviously fake values (for example, phone numbers starting with `90000`).
4. Access checks happen on the server. Hiding a button is not access control.
5. Apply small-group suppression (n < 10) to every aggregate shown or exported.
6. Every new kind of personal data collected must map to a consent purpose in `prd.md` section 6.2. If it does not, do not collect it.

## 4. Ownership and conflict avoidance

| Area | Owner | Paths |
| --- | --- | --- |
| Trainee + Follow-up agent | M1 | `src/app/trainee/**`, `src/app/agent/**`, `src/features/trainee/**`, `src/features/agent/**` |
| Training provider + Employer | M2 | `src/app/provider/**`, `src/app/employer/**`, `src/features/provider/**`, `src/features/employer/**` |
| Government (district + state) | M3 | `src/app/gov/**`, `src/features/gov/**` |
| Shared | All (review required) | `src/app/(public)/**`, `src/features/auth/**`, `src/app/layout.tsx`, `src/app/globals.css`, `src/components/**`, `src/lib/**`, `src/types/**`, `src/mocks/**`, `prisma/**`, `package.json`, config files, all `.md` docs |

Rules:

1. Edit only your own area in your feature branch.
2. If you need a change in a **shared** path, make it in a small, separate pull request to `main`, tell the team in chat, and get one approval. Do not mix shared changes into a feature pull request.
3. Need a new shared component? Check `src/components` first. If it does not exist, propose it in chat before building it, so two people do not build the same thing.
4. `prisma/schema.prisma` and `package.json` are the most conflict-prone files. Change them in their own pull requests and merge them quickly.
5. Do not reformat files you are not otherwise changing.

## 5. Git workflow

- `main` always builds and runs. Nobody pushes directly to `main` after Phase 1; changes go through pull requests.
- Branch names: `feature/<name>-<area>` (for example `feature/sinu-gov`), `fix/<short-description>`, `docs/<short-description>`.
- Sync with `main` at least once a day: `git fetch origin` then `git merge origin/main` into your branch. Resolve conflicts in your branch, not in `main`.
- Commit messages follow Conventional Commits: `feat(gov): add district comparison table`, `fix(trainee): validate phone length`, `docs: update metric definitions`.
- One logical change per commit. Pull requests stay small (aim for under 400 changed lines, excluding lockfiles).
- Pull request description: what changed, why, screenshots at 360px and 1280px for UI changes, and which PRD requirement IDs it covers (for example `FR-G-03`).
- Squash-merge pull requests into `main`.
- Never commit `node_modules`, `dist`, `.next` or other generated folders. Stage files by name, and if `git status` lists any of them, stop and fix `.gitignore` first.

## 6. Definition of done

A task is done only when:

- [ ] It meets the PRD requirement it references
- [ ] It follows `design.md` (tokens, components, copy rules) and uses no banned pattern
- [ ] Lint, typecheck and build pass
- [ ] It works at 360px (trainee screens) or 768px and 1280px (staff screens)
- [ ] It is usable with the keyboard alone and passes the accessibility checklist in `design.md` section 11
- [ ] Empty, loading and error states exist where data is shown
- [ ] `tasks.md` is updated, and `memory.md` records any new decision

## 7. Rules for AI assistants

- Read `memory.md` first, then the docs relevant to the task.
- Do not add dependencies without saying why and asking first.
- Do not create new top-level folders or change the structure in `architecture.md` without approval.
- Do not touch files outside the task's area.
- Do not write placeholder marketing copy. If real copy is not available, use a clearly marked `TODO(copy):` comment and neutral text.
- Never use em dashes in code comments, UI copy or documentation.
