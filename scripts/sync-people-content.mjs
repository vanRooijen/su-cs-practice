// TODO(legacy-link-migration): This script contains legacy *.cs.sun.ac.za URLs. Replace direct links with internal route targets or resolver mappings when migration rules are finalized.
import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'external', 'cs-sun-pages');
const contentRoot = path.join(projectRoot, 'content', 'people');

const STAFF_SOURCE_FILE = path.join(sourceRoot, 'cs.sun.ac.za_people_staff_.html');
const STUDENTS_SOURCE_FILE = path.join(sourceRoot, 'cs.sun.ac.za_people_students_.html');
const ALUMNI_SOURCE_FILE = path.join(sourceRoot, 'cs.sun.ac.za_people_alumni_.html');

const PEOPLE_IMAGE_PLACEHOLDER = '/cs-assets/people/missing-profile.svg';
const KNOWN_PLACEHOLDER_IMAGE_BASENAMES = new Set([
  'placeholder.jpg',
  'anonymous.jpg',
  'athele.jpg',
  'csteenkamp.jpg',
  'kerwin.jpg',
  'wmostert.jpg',
]);

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeMdCell(value = '') {
  return String(value).replace(/\|/g, '\\|').trim();
}

function decodeObfuscatedEmail(root) {
  const user = cleanText(root?.querySelector('.uu')?.textContent ?? '');
  const domain = cleanText(root?.querySelector('.dd')?.textContent ?? '');
  if (!user || !domain) {
    return '';
  }
  return `${user}@${domain}`;
}

function parseImagePathFromCell(cell) {
  const style = cell?.querySelector('.center-cropped')?.getAttribute('style') ?? '';
  const match = /url\((?:'|")?([^'"()]+)(?:'|")?\)/.exec(style);
  if (!match?.[1]) {
    return PEOPLE_IMAGE_PLACEHOLDER;
  }

  const sourcePath = match[1].trim();
  if (!sourcePath.startsWith('/assets/people/')) {
    return PEOPLE_IMAGE_PLACEHOLDER;
  }

  return `/cs-assets/${sourcePath.replace(/^\/assets\//, '')}`;
}

function isKnownPlaceholderImagePath(imagePath = '') {
  if (!imagePath) {
    return true;
  }

  const basename = imagePath.split('/').at(-1)?.toLowerCase() ?? '';
  return KNOWN_PLACEHOLDER_IMAGE_BASENAMES.has(basename);
}

async function resolveImagePath(imagePath) {
  if (!imagePath || imagePath === PEOPLE_IMAGE_PLACEHOLDER || isKnownPlaceholderImagePath(imagePath)) {
    return PEOPLE_IMAGE_PLACEHOLDER;
  }

  const publicFilePath = path.join(projectRoot, 'public', imagePath.replace(/^\//, ''));
  try {
    await access(publicFilePath);
    return imagePath;
  } catch {
    return PEOPLE_IMAGE_PLACEHOLDER;
  }
}

async function parseStaffRows(table) {
  const rows = [];

  for (const tr of table.querySelectorAll('tbody tr')) {
    const nameCell = tr.querySelector('td.name');
    const contactCell = tr.querySelector('td.contact');
    const researchCell = tr.querySelector('td.research');

    const name = cleanText(nameCell?.querySelector('.name')?.textContent ?? '');
    const role = cleanText(nameCell?.querySelector('.jobtitle')?.textContent ?? '');

    const office = cleanText(contactCell?.querySelector('.office')?.textContent ?? '');
    const emailObfuscated = decodeObfuscatedEmail(contactCell?.querySelector('.email .spsp'));
    const emailRaw = cleanText(contactCell?.querySelector('.email')?.textContent ?? '');
    const email = emailObfuscated || emailRaw;
    const websiteHref = contactCell?.querySelector('.www a')?.getAttribute('href') ?? '';
    const phone = cleanText(contactCell?.querySelector('.phone')?.textContent ?? '');

    const contactParts = [];
    if (office) {
      contactParts.push(office);
    }
    if (email) {
      contactParts.push(`[${email}](mailto:${email})`);
    }
    if (websiteHref) {
      contactParts.push(`[Website](${websiteHref})`);
    }
    if (phone) {
      contactParts.push(phone);
    }

    rows.push({
      image: await resolveImagePath(parseImagePathFromCell(tr.querySelector('td.picture'))),
      name,
      role,
      contact: contactParts.join('; '),
      research: cleanText(researchCell?.querySelector('.research')?.textContent ?? researchCell?.textContent ?? ''),
    });
  }

  return rows;
}

async function parseStudentRows(table) {
  const rows = [];

  for (const tr of table.querySelectorAll('tbody tr')) {
    const name = cleanText(tr.querySelector('td.name .name')?.textContent ?? '');
    const supervisor = cleanText(tr.querySelector('td.supervisor .supervisor')?.textContent ?? '').replace(/,\s*$/, '');
    const research = cleanText(tr.querySelector('td.research .research')?.textContent ?? '');

    rows.push({
      image: await resolveImagePath(parseImagePathFromCell(tr.querySelector('td.picture'))),
      name,
      supervisor,
      research,
    });
  }

  return rows;
}

function parseListItemText(li) {
  const parts = [];

  for (const node of li.childNodes) {
    if (node.nodeType === node.TEXT_NODE) {
      const text = cleanText(node.textContent ?? '');
      if (text) {
        parts.push(text);
      }
      continue;
    }

    if (node.nodeType === node.ELEMENT_NODE) {
      const element = node;
      if (element.tagName.toLowerCase() === 'a') {
        const href = element.getAttribute('href') ?? '';
        const label = cleanText(element.textContent ?? '');
        if (href && label) {
          parts.push(`[${label}](${href})`);
          continue;
        }
      }

      const text = cleanText(element.textContent ?? '');
      if (text) {
        parts.push(text);
      }
    }
  }

  return parts
    .join(' ')
    .replace(/\s+,/g, ',')
    .replace(/\s+:/g, ':')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
}

function tableHeader(columns) {
  return `| ${columns.join(' | ')} |\n| ${columns.map(() => '---').join(' | ')} |`;
}

async function syncStaff() {
  const sourceHtml = await readFile(STAFF_SOURCE_FILE, 'utf8');
  const doc = new JSDOM(sourceHtml).window.document;
  const tables = [...doc.querySelectorAll('table.people')];

  const academicRows = await parseStaffRows(tables[0]);
  const adminRows = await parseStaffRows(tables[1]);

  const academicTable = [
    tableHeader(['Photo', 'Name', 'Role', 'Contact', 'Research Interests']),
    ...academicRows.map((row) =>
      `| ${escapeMdCell(`<img src="${row.image}" alt="${row.name}" width="96" height="96" />`)} | ${escapeMdCell(row.name)} | ${escapeMdCell(row.role)} | ${escapeMdCell(row.contact)} | ${escapeMdCell(row.research)} |`,
    ),
  ].join('\n');

  const adminTable = [
    tableHeader(['Photo', 'Name', 'Role', 'Contact']),
    ...adminRows.map((row) =>
      `| ${escapeMdCell(`<img src="${row.image}" alt="${row.name}" width="96" height="96" />`)} | ${escapeMdCell(row.name)} | ${escapeMdCell(row.role)} | ${escapeMdCell(row.contact)} |`,
    ),
  ].join('\n');

  const markdown = `---
title: Staff
excerpt: Academic and administrative staff listings from the official department people page.
---

## Staff

Source snapshot: [cs.sun.ac.za/people/staff](https://cs.sun.ac.za/people/staff/) (fetched on March 3, 2026).

### Academic Staff

${academicTable}

### Administrative Staff

${adminTable}
`;

  await writeFile(path.join(contentRoot, 'staff.md'), markdown, 'utf8');
}

async function syncStudents() {
  const sourceHtml = await readFile(STUDENTS_SOURCE_FILE, 'utf8');
  const doc = new JSDOM(sourceHtml).window.document;
  const tables = [...doc.querySelectorAll('table.people')];
  const doctoralRows = await parseStudentRows(tables[0]);
  const mastersRows = await parseStudentRows(tables[1]);

  const doctoralTable = [
    tableHeader(['Photo', 'Name', 'Supervisor', 'Research Topic']),
    ...doctoralRows.map(
      (row) =>
        `| ${escapeMdCell(`<img src="${row.image}" alt="${row.name}" width="96" height="96" />`)} | ${escapeMdCell(row.name)} | ${escapeMdCell(row.supervisor)} | ${escapeMdCell(row.research)} |`,
    ),
  ].join('\n');

  const mastersTable = [
    tableHeader(['Photo', 'Name', 'Supervisor', 'Research Topic']),
    ...mastersRows.map(
      (row) =>
        `| ${escapeMdCell(`<img src="${row.image}" alt="${row.name}" width="96" height="96" />`)} | ${escapeMdCell(row.name)} | ${escapeMdCell(row.supervisor)} | ${escapeMdCell(row.research)} |`,
    ),
  ].join('\n');

  const markdown = `---
title: Students
excerpt: Postgraduate student listings from the official department people page.
---

## Postgraduate Students

Source snapshot: [cs.sun.ac.za/people/students](https://cs.sun.ac.za/people/students/) (fetched on March 3, 2026).

### Doctoral Students

${doctoralTable}

### Masters Students

${mastersTable}
`;

  await writeFile(path.join(contentRoot, 'students.md'), markdown, 'utf8');
}

async function syncAlumni() {
  const sourceHtml = await readFile(ALUMNI_SOURCE_FILE, 'utf8');
  const doc = new JSDOM(sourceHtml).window.document;

  const facultyItems = [...doc.querySelectorAll('#alumni-faculty + ul li')].map(parseListItemText);
  const doctoralItems = [...doc.querySelectorAll('#doctoral-graduates + ul li')].map(parseListItemText);
  const mastersItems = [...doc.querySelectorAll('#masters-graduates + ul li')].map(parseListItemText);

  const facultyList = facultyItems.map((item) => `- ${item}`).join('\n');
  const doctoralList = doctoralItems.map((item) => `- ${item}`).join('\n');
  const mastersList = mastersItems.map((item) => `- ${item}`).join('\n');

  const markdown = `---
title: Alumni
excerpt: Alumni faculty and graduate records from the official department alumni page.
---

## Alumni Staff and Students

Source snapshot: [cs.sun.ac.za/people/alumni](https://cs.sun.ac.za/people/alumni/) (fetched on March 3, 2026).

### Alumni Faculty

${facultyList}

### Doctoral Graduates

${doctoralList}

### Masters Graduates

${mastersList}
`;

  await writeFile(path.join(contentRoot, 'alumni.md'), markdown, 'utf8');
}

async function syncIndex() {
  const sourceHtml = await readFile(STAFF_SOURCE_FILE, 'utf8');
  const doc = new JSDOM(sourceHtml).window.document;
  const staffTables = [...doc.querySelectorAll('table.people')];
  const academicCount = staffTables[0]?.querySelectorAll('tbody tr').length ?? 0;
  const adminCount = staffTables[1]?.querySelectorAll('tbody tr').length ?? 0;

  const studentsHtml = await readFile(STUDENTS_SOURCE_FILE, 'utf8');
  const studentsDoc = new JSDOM(studentsHtml).window.document;
  const studentsTables = [...studentsDoc.querySelectorAll('table.people')];
  const doctoralCount = studentsTables[0]?.querySelectorAll('tbody tr').length ?? 0;
  const mastersCount = studentsTables[1]?.querySelectorAll('tbody tr').length ?? 0;

  const markdown = `---
title: People Directory
excerpt: Staff, students, and alumni snapshots sourced from cs.sun.ac.za people pages.
---

## People

Staff, student, and alumni listings from the official department people pages.

- Academic staff: ${academicCount}
- Administrative staff: ${adminCount}
- Doctoral students: ${doctoralCount}
- Masters students: ${mastersCount}

Use the left navigation to open Staff, Students, and Alumni.

Sources:

- [Staff](https://cs.sun.ac.za/people/staff/)
- [Students](https://cs.sun.ac.za/people/students/)
- [Alumni](https://cs.sun.ac.za/people/alumni/)
`;

  await writeFile(path.join(contentRoot, 'index.md'), markdown, 'utf8');
}

async function main() {
  await syncIndex();
  await syncStaff();
  await syncStudents();
  await syncAlumni();
  console.log('People content synced from external snapshots.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
