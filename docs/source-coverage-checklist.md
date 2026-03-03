# Source Coverage Checklist

Generated on: 2026-03-03

## Status Legend

- `full-mirror`: local page mirrors the source page content (visible page content).
- `section-mirror`: local page mirrors a named section from a larger source page.
- `shared-source-split`: one source page is intentionally split into multiple local pages.
- `pending-audit`: not fully validated yet.

## Source Map

### https://cs.sun.ac.za/

- [x] `content/about/department.md` -> `section-mirror` (`Welcome` section from homepage).
- [ ] `content/reader/articles/*` -> `pending-audit` (next phase: verify every article maps to a real source article and is not fabricated).

### https://cs.sun.ac.za/contact/

- [x] `content/about/contact.md` -> `full-mirror` (contact details + visit + map + QR sections).
- [x] `content/about/visit.md` -> `section-mirror` (`Want to pay us a visit?` + `Also...` sections).

### https://cs.sun.ac.za/people/staff/

- [x] `content/people/staff.md` -> `full-mirror`.

### https://cs.sun.ac.za/people/students/

- [x] `content/people/students.md` -> `full-mirror`.

### https://cs.sun.ac.za/people/alumni/

- [x] `content/people/alumni.md` -> `full-mirror` (full historical lists restored; no truncation).

### https://cs.sun.ac.za/teaching/programmes/

- [x] `content/programs/guide.md` -> `full-mirror` (with intentional internal link normalization to local `/programs/*` routes).

### https://cs.sun.ac.za/teaching/UG/

- [x] `content/programs/undergraduate-modules.md` -> `full-mirror`.

### https://cs.sun.ac.za/teaching/PG/

- [x] `content/programs/postgraduate-modules.md` -> `full-mirror` (lecturer/profile links restored in module entries).

### https://cs.sun.ac.za/teaching/prospectiveUG/

- [x] `content/programs/prospective-undergraduate.md` -> `full-mirror` (with intentional internal link normalization to local `/programs/*` routes).

### https://cs.sun.ac.za/teaching/prospectivePG/

- [x] `content/programs/prospective-postgraduate.md` -> `full-mirror`.

### https://cs.sun.ac.za/teaching/honours/

- [x] `content/programs/honours.md` -> `full-mirror`.

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

## Quality Guardrails

- Keep page text source-faithful: no invented facts.
- Remove meta-style wording (for example `Source-synced...`, `Recent Snapshot`) from user-facing content.
- Keep explicit `Source` attribution only where coverage is section-based or split-source and still under review.
