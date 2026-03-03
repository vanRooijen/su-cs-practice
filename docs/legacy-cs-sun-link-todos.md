# Legacy cs.sun.ac.za Link TODO Inventory

Generated on: 2026-03-03

This checklist tracks every source occurrence of a legacy URL whose host ends with `cs.sun.ac.za`.

## Summary

- Total legacy URL occurrences: **140**
- Source files with legacy URLs: **32**

### Host Counts

- cs.sun.ac.za: 79
- www.cs.sun.ac.za: 54
- computer-science.pages.cs.sun.ac.za: 3
- cs345.cs.sun.ac.za: 1
- algos.cs.sun.ac.za: 1
- marceldunaiski.pages.cs.sun.ac.za: 1
- engel.pages.cs.sun.ac.za: 1

### Type Counts

- legacy-teaching-page: 34
- legacy-short-course-code-page: 25
- legacy-user-homepage: 22
- legacy-people-page: 12
- legacy-course-page: 10
- legacy-research-page: 6
- legacy-static-pdf: 6
- legacy-root-or-contact: 5
- subdomain-pages-site: 5
- legacy-feature-article: 4
- legacy-misc: 4
- legacy-newsfeed-article: 4
- course-subdomain: 2
- legacy-project-page: 1

## course-subdomain

Suggested handling: Normalize subdomain course sites into canonical module routes, with optional reverse links.

- [ ] TODO: Migrate `https://cs345.cs.sun.ac.za` at `content/programs/postgraduate-modules.md:42`
- [ ] TODO: Migrate `http://algos.cs.sun.ac.za` at `content/programs/undergraduate-modules.md:49`

## legacy-course-page

Suggested handling: Treat as module/course pages; map to `/programs/modules/*` (or canonical course routes).

- [ ] TODO: Migrate `http://www.cs.sun.ac.za/courses/cs797` at `content/programs/postgraduate-modules.md:12`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/courses/computer-science-security` at `content/programs/postgraduate-modules.md:25`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/courses/computing-and-society` at `content/programs/postgraduate-modules.md:27`
- [ ] TODO: Migrate `https://cs.sun.ac.za/courses/artificial-intelligence/` at `content/programs/postgraduate-modules.md:28`
- [ ] TODO: Migrate `https://cs.sun.ac.za/courses/functional/` at `content/programs/postgraduate-modules.md:29`
- [ ] TODO: Migrate `https://cs.sun.ac.za/courses/data-science/` at `content/programs/postgraduate-modules.md:38`
- [ ] TODO: Migrate `https://cs.sun.ac.za/courses/space-science/` at `content/programs/postgraduate-modules.md:39`
- [ ] TODO: Migrate `https://www.cs.sun.ac.za/courses/cog-rob/` at `content/programs/postgraduate-modules.md:40`
- [ ] TODO: Migrate `https://cs.sun.ac.za/courses/space-science/` at `content/programs/undergraduate-modules.md:52`
- [ ] TODO: Migrate `https://cs.sun.ac.za/courses/functional/` at `content/programs/undergraduate-modules.md:53`

## legacy-feature-article

Suggested handling: Create slug mapping into `/reader/articles/*`; if missing, route to reader fallback with source reference.

- [ ] TODO: Migrate `https://cs.sun.ac.za/features/2019/02/20/best-jobs.html` at `content/reader/articles/best-jobs-2024.md:19`
- [ ] TODO: Migrate `https://cs.sun.ac.za/features/2018/01/14/everyone-should-code.html` at `content/reader/articles/everyone-should-code.md:21`
- [ ] TODO: Migrate `https://cs.sun.ac.za/features/2018/01/14/great-career.html` at `content/reader/articles/looking-for-a-great-career.md:19`
- [ ] TODO: Migrate `https://cs.sun.ac.za/features/2018/03/16/what-is-computer-science.html` at `content/reader/articles/what-is-computer-science.md:19`

## legacy-misc

Suggested handling: Normalize malformed URLs (double slashes, odd variants) before route resolution, then map by policy.

- [ ] TODO: Migrate `http://cs.sun.ac.za//teaching/prospectivePG` at `content/programs/honours.md:14`
- [ ] TODO: Migrate `http://cs.sun.ac.za//teaching/PG` at `content/programs/honours.md:22`
- [ ] TODO: Migrate `http://cs.sun.ac.za//teaching/prospectivePG` at `content/programs/masters.md:16`
- [ ] TODO: Migrate `http://cs.sun.ac.za//teaching/prospectivePG` at `content/programs/phd.md:16`

## legacy-newsfeed-article

Suggested handling: Same as feature articles: alias to `/reader/articles/*` via migration table.

- [ ] TODO: Migrate `https://cs.sun.ac.za/newsfeed/2019/04/15/Jane-Street-Depth-First-Learning-fellows.html` at `content/reader/articles/ai-research-colloquium-2026.md:19`
- [ ] TODO: Migrate `https://cs.sun.ac.za/newsfeed/2019/08/05/Career-Fair-2019.html` at `content/reader/articles/industry-innovation-summit-2026.md:19`
- [ ] TODO: Migrate `https://cs.sun.ac.za/newsfeed/2019/02/21/ieeeeirc.html` at `content/reader/articles/phd-student-on-his-way-to-naples.md:19`
- [ ] TODO: Migrate `https://cs.sun.ac.za/newsfeed/2019/02/21/Open-Day-2019.html` at `content/reader/articles/postgraduate-open-day-2026.md:19`

## legacy-people-page

Suggested handling: Map to canonical internal people routes (`/people/*`) and preserve deep path aliases.

- [ ] TODO: Migrate `https://cs.sun.ac.za/people/alumni/` at `content/people/alumni.md:10`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/staff/` at `content/people/index.md:21`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/students/` at `content/people/index.md:22`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/alumni/` at `content/people/index.md:23`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/staff/` at `content/people/staff.md:10`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/students/` at `content/people/students.md:10`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/staff/` at `scripts/sync-people-content.mjs:200`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/students/` at `scripts/sync-people-content.mjs:244`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/alumni/` at `scripts/sync-people-content.mjs:277`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/staff/` at `scripts/sync-people-content.mjs:328`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/students/` at `scripts/sync-people-content.mjs:329`
- [ ] TODO: Migrate `https://cs.sun.ac.za/people/alumni/` at `scripts/sync-people-content.mjs:330`

## legacy-project-page

Suggested handling: Map project microsites (e.g. `/coastal`) into `/research/projects/*` and preserve old entrypoints.

- [ ] TODO: Migrate `http://www.cs.sun.ac.za/coastal/` at `content/research/software-engineering-verification.md:27`

## legacy-research-page

Suggested handling: Map to internal research routes (`/research/*`) with a deterministic alias table.

- [ ] TODO: Migrate `https://cs.sun.ac.za/research/` at `content/research/automata-grammars.md:28`
- [ ] TODO: Migrate `https://cs.sun.ac.za/research/` at `content/research/broadband-networks.md:20`
- [ ] TODO: Migrate `https://cs.sun.ac.za/research/` at `content/research/index.md:15`
- [ ] TODO: Migrate `https://cs.sun.ac.za/research/` at `content/research/machine-learning-ai.md:26`
- [ ] TODO: Migrate `https://cs.sun.ac.za/research/` at `content/research/software-engineering-verification.md:31`
- [ ] TODO: Migrate `https://cs.sun.ac.za/research/` at `scripts/sync-programs-research-content.mjs:61`

## legacy-root-or-contact

Suggested handling: Map directly to internal content routes (`/about`, `/about/contact`) with permanent redirects.

- [ ] TODO: Migrate `https://cs.sun.ac.za/contact/` at `content/about/contact.md:34`
- [ ] TODO: Migrate `https://cs.sun.ac.za/` at `content/about/department.md:18`
- [ ] TODO: Migrate `https://cs.sun.ac.za/` at `content/about/index.md:20`
- [ ] TODO: Migrate `https://cs.sun.ac.za/contact/` at `content/about/index.md:20`
- [ ] TODO: Migrate `https://cs.sun.ac.za/contact/` at `content/about/visit.md:23`

## legacy-short-course-code-page

Suggested handling: Resolve course code endpoints (`rw*`, `cs*`, `wb*`) via a dedicated code-to-route lookup table.

- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw771` at `content/programs/honours.md:20`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw771` at `content/programs/honours.md:44`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw878` at `content/programs/postgraduate-modules.md:14`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw978` at `content/programs/postgraduate-modules.md:16`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw771` at `content/programs/postgraduate-modules.md:20`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw712` at `content/programs/postgraduate-modules.md:24`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw714` at `content/programs/postgraduate-modules.md:32`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/cs741` at `content/programs/postgraduate-modules.md:36`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw713` at `content/programs/postgraduate-modules.md:37`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw744` at `content/programs/postgraduate-modules.md:41`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw113` at `content/programs/undergraduate-modules.md:24`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw114` at `content/programs/undergraduate-modules.md:25`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw144` at `content/programs/undergraduate-modules.md:26`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rwe214` at `content/programs/undergraduate-modules.md:30`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw214` at `content/programs/undergraduate-modules.md:31`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw244` at `content/programs/undergraduate-modules.md:32`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/wb272` at `content/programs/undergraduate-modules.md:33`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw314` at `content/programs/undergraduate-modules.md:38`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw315` at `content/programs/undergraduate-modules.md:39`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw343` at `content/programs/undergraduate-modules.md:40`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw344` at `content/programs/undergraduate-modules.md:41`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw345` at `content/programs/undergraduate-modules.md:42`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/wb372` at `content/programs/undergraduate-modules.md:43`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/rw315` at `content/programs/undergraduate-modules.md:48`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/cs741` at `content/programs/undergraduate-modules.md:50`

## legacy-static-pdf

Suggested handling: Mirror documents into local assets/docs and map old URLs to new stable document routes.

- [ ] TODO: Migrate `https://cs.sun.ac.za/assets/pdfs/HonoursTimetable1stSem.pdf` at `content/programs/honours.md:41`
- [ ] TODO: Migrate `https://cs.sun.ac.za/assets/pdfs/HonoursTimetable2ndSem.pdf` at `content/programs/honours.md:42`
- [ ] TODO: Migrate `https://cs.sun.ac.za/assets/pdfs/rw797-intro.pdf` at `content/programs/honours.md:43`
- [ ] TODO: Migrate `https://cs.sun.ac.za/assets/pdfs/plagform-written-work.pdf` at `content/programs/honours.md:49`
- [ ] TODO: Migrate `https://cs.sun.ac.za/assets/pdfs/plagform-code.pdf` at `content/programs/honours.md:50`
- [ ] TODO: Migrate `https://cs.sun.ac.za/assets/pdfs/rw797-module-framework.pdf` at `content/programs/honours.md:54`

## legacy-teaching-page

Suggested handling: Map to internal programs routes (`/programs/*`) and keep backward-compatible aliases.

- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/programmes/` at `content/programs/guide.md:8`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/honours/` at `content/programs/honours.md:8`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/teaching/PG` at `content/programs/honours.md:28`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/programmes/` at `content/programs/index.md:23`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/UG/` at `content/programs/index.md:24`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/PG/` at `content/programs/index.md:25`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectiveUG/` at `content/programs/index.md:26`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectivePG/` at `content/programs/index.md:27`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/honours/` at `content/programs/index.md:28`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/masters/` at `content/programs/index.md:29`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/phd/` at `content/programs/index.md:30`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/masters/` at `content/programs/masters.md:8`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/phd/` at `content/programs/phd.md:8`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/PG/` at `content/programs/postgraduate-modules.md:8`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectivePG/` at `content/programs/prospective-postgraduate.md:8`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectiveUG/` at `content/programs/prospective-undergraduate.md:8`
- [ ] TODO: Migrate `https://www.cs.sun.ac.za/teaching/programmes/` at `content/programs/prospective-undergraduate.md:75`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/UG/` at `content/programs/undergraduate-modules.md:8`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/programmes/` at `scripts/sync-programs-research-content.mjs:21`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/UG/` at `scripts/sync-programs-research-content.mjs:26`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/PG/` at `scripts/sync-programs-research-content.mjs:31`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectiveUG/` at `scripts/sync-programs-research-content.mjs:36`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectivePG/` at `scripts/sync-programs-research-content.mjs:41`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/honours/` at `scripts/sync-programs-research-content.mjs:46`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/masters/` at `scripts/sync-programs-research-content.mjs:51`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/phd/` at `scripts/sync-programs-research-content.mjs:56`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/programmes/` at `scripts/sync-programs-research-content.mjs:511`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/UG/` at `scripts/sync-programs-research-content.mjs:512`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/PG/` at `scripts/sync-programs-research-content.mjs:513`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectiveUG/` at `scripts/sync-programs-research-content.mjs:514`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/prospectivePG/` at `scripts/sync-programs-research-content.mjs:515`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/honours/` at `scripts/sync-programs-research-content.mjs:516`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/masters/` at `scripts/sync-programs-research-content.mjs:517`
- [ ] TODO: Migrate `https://cs.sun.ac.za/teaching/phd/` at `scripts/sync-programs-research-content.mjs:518`

## legacy-user-homepage

Suggested handling: Handle `www.cs.sun.ac.za/~user/...` via a dedicated personal-page resolver and profile route namespace.

- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~whkbester/` at `content/people/staff.md:17`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~bfischer/` at `content/people/staff.md:23`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~tlgrobler/` at `content/people/staff.md:24`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~cinggs/` at `content/people/staff.md:26`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~kroon/` at `content/people/staff.md:28`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~ngxandem` at `content/people/staff.md:29`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~abvdm/` at `content/people/staff.md:35`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~lvzijl/` at `content/people/staff.md:36`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~wvisser/` at `content/people/staff.md:38`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~whkbester/` at `content/research/automata-grammars.md:17`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~abvdm/` at `content/research/automata-grammars.md:19`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~lvzijl/` at `content/research/automata-grammars.md:21`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~lvzijl/research.html` at `content/research/automata-grammars.md:25`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~abvdm/regex.html` at `content/research/automata-grammars.md:26`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~jaco/` at `content/research/broadband-networks.md:16`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~aek1/` at `content/research/broadband-networks.md:17`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~wvisser/` at `content/research/broadband-networks.md:18`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~kroon/decision.html` at `content/research/machine-learning-ai.md:20`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~bfischer/` at `content/research/software-engineering-verification.md:17`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~jaco/` at `content/research/software-engineering-verification.md:18`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~cinggs/` at `content/research/software-engineering-verification.md:19`
- [ ] TODO: Migrate `http://www.cs.sun.ac.za/~wvisser/` at `content/research/software-engineering-verification.md:23`

## subdomain-pages-site

Suggested handling: Treat as legacy microsites (`*.pages.cs.sun.ac.za`); migrate to owned routes or use controlled passthrough.

- [ ] TODO: Migrate `https://marceldunaiski.pages.cs.sun.ac.za/` at `content/people/staff.md:20`
- [ ] TODO: Migrate `https://engel.pages.cs.sun.ac.za/` at `content/people/staff.md:22`
- [ ] TODO: Migrate `https://computer-science.pages.cs.sun.ac.za/computer-networks/website/` at `content/programs/postgraduate-modules.md:31`
- [ ] TODO: Migrate `https://computer-science.pages.cs.sun.ac.za/computer-networks/website/` at `content/programs/undergraduate-modules.md:37`
- [ ] TODO: Migrate `https://computer-science.pages.cs.sun.ac.za/computer-networks/website/` at `content/programs/undergraduate-modules.md:47`
