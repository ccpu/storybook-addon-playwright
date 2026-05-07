import { getIframeDocument } from './get-iframe-document';

export function getIframeScrollPosition(iframe: HTMLIFrameElement) {
  const iframeDocument = getIframeDocument(iframe);

  if (!iframeDocument) {
    return { scrollLeft: 0, scrollTop: 0 };
  }

  const frameWindow = iframeDocument.defaultView;

  const scrollTop =
    (frameWindow ? frameWindow.pageYOffset : 0) ||
    iframeDocument.documentElement.scrollTop;
  const scrollLeft =
    (frameWindow ? frameWindow.pageXOffset : 0) ||
    iframeDocument.documentElement.scrollLeft;

  return { scrollLeft, scrollTop };
}
