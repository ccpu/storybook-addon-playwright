import { getConfigs } from '../server/configs';

export interface ClientConfig {
  selectorAttributeNames: string[];
}

const DEFAULT_SELECTOR_ATTRIBUTE_NAMES = ['id'];

function getDefaultSelectorAttributeNames() {
  return [...DEFAULT_SELECTOR_ATTRIBUTE_NAMES];
}

function normalizeSelectorAttributeNames(names?: string[]) {
  if (names === undefined) return getDefaultSelectorAttributeNames();
  if (!Array.isArray(names)) return getDefaultSelectorAttributeNames();

  // Keep configured order and dedupe names case-insensitively.
  const seen = new Set<string>();

  return names
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
    .filter((name) => {
      const normalized = name.toLowerCase();

      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
}

export function getClientConfig(): ClientConfig {
  const { selectorAttributeNames } = getConfigs();

  return {
    selectorAttributeNames: normalizeSelectorAttributeNames(selectorAttributeNames),
  };
}
