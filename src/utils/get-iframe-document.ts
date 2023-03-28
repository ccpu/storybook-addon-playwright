export const getIframeDocument = (iframe: HTMLIFrameElement) => {
  return iframe.contentDocument || iframe.contentWindow.document;
};
