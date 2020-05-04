import { getIframe } from './get-iframe';

export const findSelector = (selector: string) => {
  const element = getIframe().contentWindow.document.querySelector(selector);
  return element;
};
