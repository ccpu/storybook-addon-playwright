import { getPreviewIframe } from './get-iframe';

export const findSelector = (selector: string) => {
  const element =
    getPreviewIframe().contentWindow.document.querySelector(selector);
  return element;
};
