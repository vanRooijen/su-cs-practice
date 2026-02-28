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

export function resolveContent(appId, subroute = '') {
  const cleanedSubroute = trimSlashes(subroute);
  const dotted = toDotted(cleanedSubroute);

  const candidates = cleanedSubroute
    ? [`${appId}.${dotted}`, `${appId}.${dotted}.index`]
    : [`${appId}.index`];

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
  return Object.values(CONTENT_ARTIFACTS)
    .filter((artifact) => artifact.appId === 'reader' && artifact.subroute.startsWith('articles/'))
    .sort((left, right) => left.title.localeCompare(right.title));
}
