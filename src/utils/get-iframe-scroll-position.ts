import { getIframeDocument } from './get-iframe-document';

export const getIframeScrollPosition = (iframe: HTMLIFrameElement) => {
  const iframeDocument = getIframeDocument(iframe);
  const scrollTop =
    iframeDocument.defaultView.pageYOffset ||
    iframeDocument.documentElement.scrollTop;
  const scrollLeft =
    iframeDocument.defaultView.pageXOffset ||
    iframeDocument.documentElement.scrollLeft;

  return { scrollLeft, scrollTop };
};
