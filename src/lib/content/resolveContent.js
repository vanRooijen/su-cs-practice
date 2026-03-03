import { CONTENT_ARTIFACTS } from '../../generated/content-artifacts.js';

const EMPTY_CONTENT = {
  key: 'missing',
  title: 'Content Not Found',
  excerpt: '',
  html: '<p>The selected content key does not exist in this deployment.</p>',
};

function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function toDotted(subroute = '') {
  const cleaned = trimSlashes(subroute);
  return cleaned ? cleaned.split('/').join('.') : 'index';
}

function getCandidateKeys(appId, subroute = '') {
  const cleanedSubroute = trimSlashes(subroute);
  const dotted = toDotted(cleanedSubroute);

  return cleanedSubroute
    ? [`${appId}.${dotted}`, `${appId}.${dotted}.index`]
    : [`${appId}.index`];
}

export function hasContent(appId, subroute = '') {
  return getCandidateKeys(appId, subroute).some((key) => Boolean(CONTENT_ARTIFACTS[key]));
}

export function resolveContent(appId, subroute = '') {
  const cleanedSubroute = trimSlashes(subroute);
  const dotted = toDotted(cleanedSubroute);
  const candidates = getCandidateKeys(appId, cleanedSubroute);

  for (const key of candidates) {
    if (CONTENT_ARTIFACTS[key]) {
      return CONTENT_ARTIFACTS[key];
    }
  }

  return {
    ...EMPTY_CONTENT,
    key: `${appId}.${dotted}`,
  };
}

export function listReaderArticles() {
  const toOptionalNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  return Object.values(CONTENT_ARTIFACTS)
    .filter((artifact) => artifact.appId === 'reader' && artifact.subroute.startsWith('articles/'))
    .sort((left, right) => {
      const leftOrder = toOptionalNumber(left?.meta?.sort_order ?? left?.meta?.sortOrder);
      const rightOrder = toOptionalNumber(right?.meta?.sort_order ?? right?.meta?.sortOrder);

      if (leftOrder !== null || rightOrder !== null) {
        if (leftOrder === null) {
          return 1;
        }
        if (rightOrder === null) {
          return -1;
        }

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }
      }

      return left.title.localeCompare(right.title);
    });
}

function fromMeta(artifact, ...keys) {
  for (const key of keys) {
    const value = artifact?.meta?.[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function normalizedMetaValue(artifact, ...keys) {
  return fromMeta(artifact, ...keys).toLowerCase();
}

function isNewsfeedArticle(artifact) {
  const badge = normalizedMetaValue(artifact, 'card_badge', 'cardBadge');
  if (badge === 'newsfeed') {
    return true;
  }

  if (typeof artifact?.subroute === 'string' && artifact.subroute.startsWith('articles/newsfeed-')) {
    return true;
  }

  const sourceUrl = normalizedMetaValue(artifact, 'source_url', 'sourceUrl');
  return sourceUrl.includes('/newsfeed/');
}

function getArticleArchiveGroup(artifact) {
  const explicitGroup = normalizedMetaValue(
    artifact,
    'newsroll_group',
    'newsrollGroup',
    'archive_group',
    'archiveGroup',
  );

  if (explicitGroup === 'main' || explicitGroup === 'primary' || explicitGroup === 'current' || explicitGroup === 'timeless') {
    return 'primary';
  }

  if (explicitGroup === 'archive' || explicitGroup === 'newsroll-archive') {
    return 'archive';
  }

  return isNewsfeedArticle(artifact) ? 'archive' : 'primary';
}

export function listReaderArticleCollections() {
  const all = listReaderArticles();
  const primary = [];
  const archive = [];

  for (const article of all) {
    if (getArticleArchiveGroup(article) === 'archive') {
      archive.push(article);
    } else {
      primary.push(article);
    }
  }

  return {
    all,
    primary,
    archive,
  };
}
