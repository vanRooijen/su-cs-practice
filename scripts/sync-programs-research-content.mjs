import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'external', 'cs-sun-pages');

const programsContentRoot = path.join(projectRoot, 'content', 'programs');
const researchContentRoot = path.join(projectRoot, 'content', 'research');

const PEOPLE_IMAGE_PLACEHOLDER = '/cs-assets/people/placeholder.jpg';

const PROGRAM_SOURCE_FILES = {
  guide: {
    sourceFile: 'cs.sun.ac.za_teaching_programmes_.html',
    outputFile: 'guide.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/programmes/',
  },
  undergraduate: {
    sourceFile: 'cs.sun.ac.za_teaching_UG_.html',
    outputFile: 'undergraduate-modules.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/UG/',
  },
  postgraduate: {
    sourceFile: 'cs.sun.ac.za_teaching_PG_.html',
    outputFile: 'postgraduate-modules.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/PG/',
  },
  prospectiveUG: {
    sourceFile: 'cs.sun.ac.za_teaching_prospectiveUG_.html',
    outputFile: 'prospective-undergraduate.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/prospectiveUG/',
  },
  prospectivePG: {
    sourceFile: 'cs.sun.ac.za_teaching_prospectivePG_.html',
    outputFile: 'prospective-postgraduate.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/prospectivePG/',
  },
  honours: {
    sourceFile: 'cs.sun.ac.za_teaching_honours_.html',
    outputFile: 'honours.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/honours/',
  },
  masters: {
    sourceFile: 'cs.sun.ac.za_teaching_masters_.html',
    outputFile: 'masters.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/masters/',
  },
  phd: {
    sourceFile: 'cs.sun.ac.za_teaching_phd_.html',
    outputFile: 'phd.md',
    sourceUrl: 'https://cs.sun.ac.za/teaching/phd/',
  },
};

const RESEARCH_SOURCE_FILE = path.join(sourceRoot, 'cs.sun.ac.za_research_.html');
const RESEARCH_SOURCE_URL = 'https://cs.sun.ac.za/research/';

const RESEARCH_GROUP_FILE_BY_ID = {
  automata: 'automata-grammars.md',
  softeng: 'software-engineering-verification.md',
  ai: 'machine-learning-ai.md',
  coe: 'broadband-networks.md',
};

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeInternalHref(rawHref = '') {
  const href = rawHref.trim();
  if (!href) {
    return href;
  }

  if (href.startsWith('/assets/')) {
    return `https://cs.sun.ac.za${href}`;
  }

  const teachingRouteMap = [
    ['/teaching/programmes/', '/programs/guide'],
    ['/teaching/ug/', '/programs/undergraduate-modules'],
    ['/teaching/pg/', '/programs/postgraduate-modules'],
    ['/teaching/prospectiveug/', '/programs/prospective-undergraduate'],
    ['/teaching/prospectivepg/', '/programs/prospective-postgraduate'],
    ['/teaching/honours/', '/programs/honours'],
    ['/teaching/masters/', '/programs/masters'],
    ['/teaching/phd/', '/programs/phd'],
  ];

  const normalized = href.toLowerCase();
  for (const [sourcePrefix, targetPath] of teachingRouteMap) {
    if (normalized === sourcePrefix.slice(0, -1) || normalized.startsWith(sourcePrefix)) {
      return targetPath;
    }
  }

  if (normalized === '/research' || normalized === '/research/') {
    return '/research';
  }
  if (normalized.startsWith('/research/')) {
    return href.replace(/\/+$/, '');
  }

  if (normalized === '/contact' || normalized === '/contact/') {
    return '/about/contact';
  }

  if (normalized === '/' || normalized === '/home' || normalized === '/home/') {
    return '/home';
  }

  if (normalized.startsWith('/people/')) {
    return href.replace(/\/+$/, '');
  }

  return href;
}

function escapeMdCell(value = '') {
  return String(value).replace(/\|/g, '\\|').trim();
}

function compactLines(lines) {
  const compacted = [];

  for (const line of lines) {
    if (!line) {
      if (compacted.length && compacted.at(-1) !== '') {
        compacted.push('');
      }
      continue;
    }

    compacted.push(line);
  }

  while (compacted.length && compacted.at(-1) === '') {
    compacted.pop();
  }

  return compacted;
}

function inlineMarkdown(node) {
  if (!node) {
    return '';
  }

  if (node.nodeType === node.TEXT_NODE) {
    return node.nodeValue ?? '';
  }

  if (node.nodeType !== node.ELEMENT_NODE) {
    return '';
  }

  const element = node;
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'br') {
    return '\n';
  }

  const childText = [...element.childNodes].map((child) => inlineMarkdown(child)).join('');
  const text = cleanText(childText);

  if (!text) {
    return '';
  }

  if (tagName === 'a') {
    const href = normalizeInternalHref(element.getAttribute('href')?.trim() ?? '');
    if (!href) {
      return text;
    }
    return `[${text}](${href})`;
  }

  if (tagName === 'strong' || tagName === 'b') {
    return `**${text}**`;
  }

  if (tagName === 'em' || tagName === 'i') {
    return `*${text}*`;
  }

  if (tagName === 'code') {
    return `\`${text}\``;
  }

  return childText;
}

function nodeText(element) {
  if (!element) {
    return '';
  }

  const text = [...element.childNodes].map((node) => inlineMarkdown(node)).join(' ');
  return cleanText(text.replace(/\s*\n\s*/g, ' '));
}

function tableToMarkdown(tableElement) {
  const rows = [...tableElement.querySelectorAll('tr')]
    .map((tr) =>
      [...tr.querySelectorAll('th, td')]
        .map((cell) => escapeMdCell(nodeText(cell)))
        .filter((cell) => cell.length > 0),
    )
    .filter((cells) => cells.length > 0);

  if (!rows.length) {
    return '';
  }

  const header = rows[0];
  const body = rows.slice(1);

  const lines = [];
  lines.push(`| ${header.join(' | ')} |`);
  lines.push(`| ${header.map(() => '---').join(' | ')} |`);

  for (const row of body) {
    const normalized = row.length < header.length ? [...row, ...Array(header.length - row.length).fill('')] : row;
    lines.push(`| ${normalized.join(' | ')} |`);
  }

  return lines.join('\n');
}

function listToMarkdown(listElement, indentLevel = 0) {
  const directChildren = [...listElement.children].filter((child) => child.tagName?.toLowerCase() === 'li');
  const ordered = listElement.tagName.toLowerCase() === 'ol';
  const lines = [];

  directChildren.forEach((li, index) => {
    const nestedLists = [...li.querySelectorAll(':scope > ul, :scope > ol')];
    const shallowClone = li.cloneNode(true);
    for (const nested of [...shallowClone.querySelectorAll('ul, ol')]) {
      nested.remove();
    }

    const itemText = nodeText(shallowClone);
    if (itemText) {
      const marker = ordered ? `${index + 1}.` : '-';
      lines.push(`${'  '.repeat(indentLevel)}${marker} ${itemText}`);
    }

    nestedLists.forEach((nestedList) => {
      lines.push(...listToMarkdown(nestedList, indentLevel + 1));
    });
  });

  return lines;
}

function parseCatalogueEntry(entryElement) {
  const code = cleanText(entryElement.querySelector('table tr td:nth-child(1)')?.textContent ?? '');
  const titleElement = entryElement.querySelector('table tr td:nth-child(2) a') ?? entryElement.querySelector('table tr td:nth-child(2)');
  const title = cleanText(titleElement?.textContent ?? 'Untitled entry');
  const link = titleElement?.getAttribute?.('href')?.trim() ?? '';
  const meta = cleanText(entryElement.querySelector('table tr td:last-child')?.textContent ?? '');
  const description = cleanText(entryElement.querySelector('p')?.textContent ?? '');

  const pieces = [];
  const label = link ? `[${title}](${link})` : title;
  pieces.push(`**${label}**`);

  if (code) {
    pieces.push(`(Code: ${code})`);
  }

  if (meta && meta !== code) {
    pieces.push(`(${meta})`);
  }

  if (description) {
    pieces.push(`- ${description}`);
  }

  return `- ${pieces.join(' ')}`.replace(/\s+/g, ' ').trim();
}

function renderElement(element) {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'p') {
    const text = nodeText(element);
    if (!text || element.classList.contains('emptypar')) {
      return [];
    }

    return [text, ''];
  }

  if (tagName === 'ul' || tagName === 'ol') {
    const listLines = listToMarkdown(element, 0);
    if (!listLines.length) {
      return [];
    }

    return [...listLines, ''];
  }

  if (tagName === 'table') {
    const tableMd = tableToMarkdown(element);
    return tableMd ? [tableMd, ''] : [];
  }

  if (tagName !== 'div') {
    return [];
  }

  if (element.classList.contains('catalogue')) {
    const entries = [...element.querySelectorAll(':scope > .catalogue-entry')].map(parseCatalogueEntry).filter(Boolean);
    if (!entries.length) {
      return [];
    }
    return [...entries, ''];
  }

  if (element.classList.contains('aside')) {
    const lines = ['### Quick Aside', ''];
    const list = element.querySelector('ul');
    if (list) {
      lines.push(...listToMarkdown(list, 0), '');
    }
    return lines;
  }

  if (element.classList.contains('research') || element.classList.contains('research-group')) {
    return [];
  }

  if (element.classList.contains('catalogue-entry')) {
    return [parseCatalogueEntry(element), ''];
  }

  const lines = [];
  for (const child of [...element.children]) {
    lines.push(...renderElement(child));
  }
  return lines;
}

function extractPage(mainBox) {
  const children = [...mainBox.children];
  const firstHeading = children.find((child) => child.tagName?.toLowerCase() === 'h1');
  const title = cleanText(firstHeading?.textContent ?? 'Untitled');

  const sections = [];
  let currentSection = {
    heading: 'Overview',
    level: 2,
    lines: [],
  };

  for (const child of children) {
    const tagName = child.tagName.toLowerCase();

    if (tagName === 'h1') {
      continue;
    }

    if (tagName === 'h2' || tagName === 'h3') {
      currentSection.lines = compactLines(currentSection.lines);
      if (currentSection.lines.length) {
        sections.push(currentSection);
      }

      currentSection = {
        heading: cleanText(child.textContent),
        level: tagName === 'h2' ? 2 : 3,
        lines: [],
      };
      continue;
    }

    currentSection.lines.push(...renderElement(child));
  }

  currentSection.lines = compactLines(currentSection.lines);
  if (currentSection.lines.length) {
    sections.push(currentSection);
  }

  return {
    title,
    sections,
  };
}

function buildPageMarkdown({ title, excerpt, sourceUrl, sections }) {
  const normalizedSections = sections.filter((section) => section.lines.length > 0);

  const lines = [
    '---',
    `title: ${title}`,
    `excerpt: ${excerpt}`,
    '---',
    '',
    `Source snapshot: [${sourceUrl.replace(/^https?:\/\//, '')}](${sourceUrl}) (fetched on March 3, 2026).`,
    '',
  ];

  for (const section of normalizedSections) {
    lines.push(`${'#'.repeat(section.level)} ${section.heading}`);
    lines.push('');
    lines.push(...section.lines);
    if (lines.at(-1) !== '') {
      lines.push('');
    }
  }

  return compactLines(lines).join('\n') + '\n';
}

function toExcerpt(value, maxLength = 180) {
  const text = cleanText(value);
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }

  const boundary = text.lastIndexOf(' ', maxLength - 1);
  const slicePoint = boundary > 30 ? boundary : maxLength - 1;
  return `${text.slice(0, slicePoint).trim()}...`;
}

function imagePathFromStyle(styleValue = '') {
  const match = /url\((?:'|")?([^'"()]+)(?:'|")?\)/.exec(styleValue);
  if (!match?.[1]) {
    return PEOPLE_IMAGE_PLACEHOLDER;
  }

  const sourcePath = match[1].trim();
  if (!sourcePath.startsWith('/assets/people/')) {
    return PEOPLE_IMAGE_PLACEHOLDER;
  }

  return `/cs-assets/${sourcePath.replace(/^\/assets\//, '')}`;
}

async function resolveImagePath(imagePath) {
  if (!imagePath || imagePath === PEOPLE_IMAGE_PLACEHOLDER) {
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

async function syncPrograms() {
  const outputs = [];

  for (const definition of Object.values(PROGRAM_SOURCE_FILES)) {
    const sourcePath = path.join(sourceRoot, definition.sourceFile);
    const sourceHtml = await readFile(sourcePath, 'utf8');
    const doc = new JSDOM(sourceHtml).window.document;
    const mainBox = doc.querySelector('main .box');

    if (!mainBox) {
      throw new Error(`No main content container in ${definition.sourceFile}`);
    }

    const { title, sections } = extractPage(mainBox);
    const firstParagraph = sections
      .flatMap((section) => section.lines)
      .find((line) => line && !line.startsWith('- ') && !line.startsWith('| '));

    const excerpt = toExcerpt(firstParagraph, 180) || `Source-synced content for ${title}.`;

    const markdown = buildPageMarkdown({
      title,
      excerpt,
      sourceUrl: definition.sourceUrl,
      sections,
    });

    const outputPath = path.join(programsContentRoot, definition.outputFile);
    await writeFile(outputPath, markdown, 'utf8');
    outputs.push({ title, outputPath, href: `/programs/${definition.outputFile.replace(/\.md$/, '')}` });
  }

  const overviewLines = [
    '---',
    'title: Programs',
    'excerpt: Undergraduate and postgraduate program information synchronized from official teaching pages.',
    '---',
    '',
    '## Programmes and Teaching',
    '',
    'Use the sidebar to navigate the synchronized programme pages below:',
    '',
    ...outputs.map((entry) => `- [${entry.title}](${entry.href})`),
    '',
    'Primary sources:',
    '',
    '- [cs.sun.ac.za/teaching/programmes](https://cs.sun.ac.za/teaching/programmes/)',
    '- [cs.sun.ac.za/teaching/UG](https://cs.sun.ac.za/teaching/UG/)',
    '- [cs.sun.ac.za/teaching/PG](https://cs.sun.ac.za/teaching/PG/)',
    '- [cs.sun.ac.za/teaching/prospectiveUG](https://cs.sun.ac.za/teaching/prospectiveUG/)',
    '- [cs.sun.ac.za/teaching/prospectivePG](https://cs.sun.ac.za/teaching/prospectivePG/)',
    '- [cs.sun.ac.za/teaching/honours](https://cs.sun.ac.za/teaching/honours/)',
    '- [cs.sun.ac.za/teaching/masters](https://cs.sun.ac.za/teaching/masters/)',
    '- [cs.sun.ac.za/teaching/phd](https://cs.sun.ac.za/teaching/phd/)',
    '',
  ];

  await writeFile(path.join(programsContentRoot, 'index.md'), overviewLines.join('\n'), 'utf8');
}

async function parseResearchGroups(doc) {
  const groups = [];

  for (const groupNode of [...doc.querySelectorAll('.research-group')]) {
    const heading = groupNode.querySelector('h2');
    if (!heading) {
      continue;
    }

    const headingText = cleanText(heading.textContent);
    const groupId = heading.id || '';

    const paragraphs = [...groupNode.querySelectorAll(':scope > p')]
      .map((paragraph) => nodeText(paragraph))
      .filter(Boolean);

    const memberRows = [];
    for (const memberNode of [...groupNode.querySelectorAll('.research-member')]) {
      const nameCell = memberNode.querySelector('.research-member-name');
      const linkNode = nameCell?.querySelector('a');
      const name = cleanText(nameCell?.textContent ?? '');
      if (!name) {
        continue;
      }

      const profileUrl = linkNode?.getAttribute('href')?.trim() ?? '';
      const style = memberNode.querySelector('.center-cropped')?.getAttribute('style') ?? '';
      const imagePath = await resolveImagePath(imagePathFromStyle(style));

      memberRows.push({
        imagePath,
        name,
        profileUrl,
      });
    }

    const links = [...groupNode.querySelectorAll('.research-links li a')].map((link) => ({
      label: cleanText(link.textContent),
      href: link.getAttribute('href')?.trim() ?? '',
    }));

    groups.push({
      id: groupId,
      title: headingText,
      paragraphs,
      members: memberRows,
      links: links.filter((link) => link.label && link.href),
    });
  }

  return groups;
}

function buildResearchGroupMarkdown(group) {
  const excerpt =
    toExcerpt(group.paragraphs[0], 180) || `${group.title} research group information from the department research page.`;

  const lines = [
    '---',
    `title: ${group.title}`,
    `excerpt: ${excerpt}`,
    '---',
    '',
    `## ${group.title}`,
    '',
    ...group.paragraphs,
    '',
  ];

  if (group.members.length) {
    lines.push('### Current Members', '');
    lines.push('| Photo | Member | Profile |', '| --- | --- | --- |');

    for (const member of group.members) {
      const memberName = escapeMdCell(member.name);
      const memberProfile = member.profileUrl ? escapeMdCell(`[Link](${member.profileUrl})`) : '';
      const photo = escapeMdCell(`<img src="${member.imagePath}" alt="${member.name}" width="40" height="40" />`);
      lines.push(`| ${photo} | ${memberName} | ${memberProfile} |`);
    }

    lines.push('');
  }

  if (group.links.length) {
    lines.push('### Related Links', '');
    for (const link of group.links) {
      lines.push(`- [${link.label}](${link.href})`);
    }
    lines.push('');
  }

  lines.push(`Source snapshot: [${RESEARCH_SOURCE_URL.replace(/^https?:\/\//, '')}](${RESEARCH_SOURCE_URL}) (fetched on March 3, 2026).`);
  lines.push('');

  return lines.join('\n');
}

async function syncResearch() {
  const sourceHtml = await readFile(RESEARCH_SOURCE_FILE, 'utf8');
  const doc = new JSDOM(sourceHtml).window.document;

  const groups = await parseResearchGroups(doc);

  const mappedGroups = groups.filter((group) => RESEARCH_GROUP_FILE_BY_ID[group.id]);

  for (const group of mappedGroups) {
    const outputFile = RESEARCH_GROUP_FILE_BY_ID[group.id];
    const markdown = buildResearchGroupMarkdown(group);
    await writeFile(path.join(researchContentRoot, outputFile), markdown, 'utf8');
  }

  const indexLines = [
    '---',
    'title: Research',
    'excerpt: Research groups synchronized from the official Computer Science research page.',
    '---',
    '',
    '## Research Groups',
    '',
    ...mappedGroups.map(
      (group) =>
        `- [${group.title}](/research/${RESEARCH_GROUP_FILE_BY_ID[group.id].replace(/\.md$/, '')}) (${group.members.length} members listed)`,
    ),
    '',
    `Source snapshot: [${RESEARCH_SOURCE_URL.replace(/^https?:\/\//, '')}](${RESEARCH_SOURCE_URL}) (fetched on March 3, 2026).`,
    '',
  ];

  await writeFile(path.join(researchContentRoot, 'index.md'), indexLines.join('\n'), 'utf8');
}

async function main() {
  await syncPrograms();
  await syncResearch();
  console.log('Programs and Research content synced from external snapshots.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
