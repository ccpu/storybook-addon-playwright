import { getPreviewIframe } from './get-preview-iframe';

export const findSelector = (selector: string) => {
  const iframe = getPreviewIframe();
  const element = iframe?.contentWindow?.document.querySelector(selector);
  return element;
};
