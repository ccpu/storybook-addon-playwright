const ROOT_SELECTOR = 'html>body>#root';
const STORYBOOK_ROOT_SELECTOR = 'html>body>#storybook-root';
const MAX_LEGACY_ROOT_INDEX = 8;

function hasQuerySelector(
  documentNode: Document | Partial<Document>,
): documentNode is Document {
  return typeof documentNode.querySelector === 'function';
}

function getRootSelector(
  documentNode: Document | Partial<Document>,
): string | undefined {
  if (!hasQuerySelector(documentNode)) return undefined;

  if (documentNode.querySelector(ROOT_SELECTOR)) return ROOT_SELECTOR;
  if (documentNode.querySelector(STORYBOOK_ROOT_SELECTOR)) {
    return STORYBOOK_ROOT_SELECTOR;
  }

  return undefined;
}

export function normalizeRootSelectorPath(
  selectorPath: string,
  documentNode: Document | Partial<Document>,
): string {
  if (!hasQuerySelector(documentNode)) return selectorPath;

  const rootSelector = getRootSelector(documentNode);

  if (!rootSelector) return selectorPath;

  const rootElement = documentNode.querySelector(rootSelector);
  if (!rootElement) return selectorPath;

  for (let index = 1; index <= MAX_LEGACY_ROOT_INDEX; index += 1) {
    const legacyRootSelector = `html>body>div:nth-child(${index})`;

    if (!selectorPath.includes(legacyRootSelector)) continue;

    const legacyRootElement = documentNode.querySelector(legacyRootSelector);

    if (legacyRootElement && legacyRootElement === rootElement) {
      return selectorPath.replace(legacyRootSelector, rootSelector);
    }
  }

  return selectorPath;
}
