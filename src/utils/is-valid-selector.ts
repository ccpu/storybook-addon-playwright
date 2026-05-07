import { findSelector } from './find-selector';

export function isValidSelector(selector: string) {
  try {
    if (!selector || findSelector(selector) == null) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
