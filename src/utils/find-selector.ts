import { getPreviewIframe } from './get-preview-iframe';

export function findSelector(selector: string) {
  const iframe = getPreviewIframe();
  const element = iframe?.contentWindow?.document.querySelector(selector);
  return element;
}
