import { findSelector } from './find-selector';

export const isValidSelector = (selector: string) => {
  try {
    if (!selector || findSelector(selector) === null) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};
