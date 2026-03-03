# Source Coverage Checklist

Generated on: 2026-03-03

## Status Legend

- `full-mirror`: local page mirrors the source page content (visible page content).
- `section-mirror`: local page mirrors a named section from a larger source page.
- `shared-source-split`: one source page is intentionally split into multiple local pages.
- `blocked-source`: source endpoint currently inaccessible from strict host.
- `pending-audit`: not fully validated yet.

## Strict-Host Scope

Only strict-host pages are included in this checklist:

- `https://cs.sun.ac.za/...`

Non-strict host links (for example `www.cs.sun.ac.za`, `*.pages.cs.sun.ac.za`) are treated as external outlinks for now.

## Covered: Core Site Pages

### https://cs.sun.ac.za/

- [x] `content/about/department.md` -> `section-mirror` (`Welcome` section from homepage).
- [ ] `content/reader/articles/*` -> `pending-audit` (verify every non-source editorial article remains intentionally authored).

### https://cs.sun.ac.za/contact/

- [x] `content/about/contact.md` -> `full-mirror`.
- [x] `content/about/visit.md` -> `section-mirror` (`Want to pay us a visit?` + `Also...` sections).

### https://cs.sun.ac.za/people/staff/

- [x] `content/people/staff.md` -> `full-mirror`.

### https://cs.sun.ac.za/people/students/

- [x] `content/people/students.md` -> `full-mirror`.

### https://cs.sun.ac.za/people/alumni/

- [x] `content/people/alumni.md` -> `full-mirror`.

### https://cs.sun.ac.za/teaching/programmes/

- [x] `content/programs/guide.md` -> `full-mirror` (with intentional internal link normalization to local `/programs/*` routes).

### https://cs.sun.ac.za/teaching/UG/

- [x] `content/programs/undergraduate-modules.md` -> `full-mirror` (strict `/courses/*` links now routed to local mirrors).

### https://cs.sun.ac.za/teaching/PG/

- [x] `content/programs/postgraduate-modules.md` -> `full-mirror` (lecturer/profile links restored; strict `/courses/*` links now routed to local mirrors).

### https://cs.sun.ac.za/teaching/prospectiveUG/

- [x] `content/programs/prospective-undergraduate.md` -> `full-mirror` (with intentional internal link normalization to local `/programs/*` routes).

### https://cs.sun.ac.za/teaching/prospectivePG/

- [x] `content/programs/prospective-postgraduate.md` -> `full-mirror`.

### https://cs.sun.ac.za/teaching/honours/

- [x] `content/programs/honours.md` -> `full-mirror`.
- [x] Linked strict-host Honours PDFs mirrored locally under `public/cs-assets/pdfs/`.

### https://cs.sun.ac.za/teaching/masters/

- [x] `content/programs/masters.md` -> `full-mirror`.

### https://cs.sun.ac.za/teaching/phd/

- [x] `content/programs/phd.md` -> `full-mirror`.

### https://cs.sun.ac.za/research/

- [ ] `content/research/index.md` -> `shared-source-split` (source attribution still present).
- [ ] `content/research/automata-grammars.md` -> `shared-source-split` (source attribution still present).
- [ ] `content/research/software-engineering-verification.md` -> `shared-source-split` (source attribution still present).
- [ ] `content/research/machine-learning-ai.md` -> `shared-source-split` (source attribution still present).
- [ ] `content/research/broadband-networks.md` -> `shared-source-split` (source attribution still present).

## Covered: Strict `/courses/*` Pages

### https://cs.sun.ac.za/courses/artificial-intelligence/

- [x] `content/programs/courses/artificial-intelligence.md` -> `full-mirror`.

### https://cs.sun.ac.za/courses/functional/

- [x] `content/programs/courses/functional.md` -> `full-mirror`.

### https://cs.sun.ac.za/courses/data-science/

- [x] `content/programs/courses/data-science.md` -> `full-mirror`.

### https://cs.sun.ac.za/courses/space-science/

- [x] `content/programs/courses/space-science.md` -> `full-mirror`.

## Covered: Strict Newsfeed

### https://cs.sun.ac.za/newsfeed/

- [x] `content/reader/newsfeed-archive.md` -> `full-mirror` (index entries preserved and linked to local mirrors).

### Newsfeed entries

- [x] 22/22 strict `https://cs.sun.ac.za/newsfeed/YYYY/MM/DD/*.html` entries mirrored under `content/reader/articles/`.
- [x] Existing named pages retained for curated routes:
  - `ai-research-colloquium-2026`
  - `industry-innovation-summit-2026`
  - `postgraduate-open-day-2026`
  - `phd-student-on-his-way-to-naples`
- [x] Remaining entries mirrored as canonical `newsfeed-YYYY-MM-DD-*.md` pages.

## Covered: Strict Feature Articles

- [x] `https://cs.sun.ac.za/features/2018/01/14/everyone-should-code.html` -> `content/reader/articles/everyone-should-code.md`
- [x] `https://cs.sun.ac.za/features/2018/01/14/great-career.html` -> `content/reader/articles/looking-for-a-great-career.md`
- [x] `https://cs.sun.ac.za/features/2018/03/16/what-is-computer-science.html` -> `content/reader/articles/what-is-computer-science.md`
- [x] `https://cs.sun.ac.za/features/2019/02/20/best-jobs.html` -> `content/reader/articles/best-jobs-2024.md`

## Blocked Or Pending

- [ ] `https://cs.sun.ac.za/people/` -> `blocked-source` (`403` as of 2026-03-03).
- [ ] `https://cs.sun.ac.za/features/` -> `blocked-source` (`403` as of 2026-03-03).
- [ ] Afrikaans strict-host variants (`/af/`, `/contact/af/`, `/newsfeed/af/`, `*_af.html`) -> `pending-audit`.
- [ ] `https://cs.sun.ac.za/teaching/first-years/` -> source link exists in snapshots, but endpoint is currently `404` (as of 2026-03-03).

## Quality Guardrails

- Keep page text source-faithful: no invented facts.
- Keep explicit `Source` attribution only where coverage is section-based or split-source and still under review.
- Treat non-strict-host links as external outlinks until migration rules for those hosts are finalized.
