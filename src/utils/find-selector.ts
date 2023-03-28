import { getPreviewIframe } from './get-preview-iframe';

export const findSelector = (selector: string) => {
  const element =
    getPreviewIframe().contentWindow.document.querySelector(selector);
  return element;
};
