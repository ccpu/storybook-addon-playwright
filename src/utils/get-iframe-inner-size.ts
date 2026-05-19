function getDocumentInnerSize(document: Document) {
  const { body, documentElement, defaultView } = document;
  if (!body || !documentElement) {
    return null;
  }

  let width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    body.clientWidth,
    documentElement.scrollWidth,
    documentElement.offsetWidth,
    documentElement.clientWidth,
  );

  let height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    body.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight,
    documentElement.clientHeight,
  );

  if (defaultView) {
    const scrollX = defaultView.scrollX;
    const scrollY = defaultView.scrollY;

    for (const element of Array.from(document.querySelectorAll('*'))) {
      if (
        !(element instanceof defaultView.HTMLElement) &&
        !(element instanceof defaultView.SVGElement)
      ) {
        continue;
      }

      const style = defaultView.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') {
        continue;
      }

      const rect = element.getBoundingClientRect();
      width = Math.max(width, Math.ceil(rect.right + scrollX));
      height = Math.max(height, Math.ceil(rect.bottom + scrollY));
    }

    for (const nestedIframe of Array.from(document.querySelectorAll('iframe'))) {
      try {
        const nestedDocument = nestedIframe.contentDocument;
        if (!nestedDocument) {
          continue;
        }

        const nestedSize = getDocumentInnerSize(nestedDocument);
        if (!nestedSize) {
          continue;
        }

        const rect = nestedIframe.getBoundingClientRect();
        width = Math.max(width, Math.ceil(rect.left + scrollX + nestedSize.width));
        height = Math.max(height, Math.ceil(rect.top + scrollY + nestedSize.height));
      } catch {
        // Ignore inaccessible nested iframes (e.g. cross-origin).
      }
    }
  }

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { width, height };
}

export function getIframeInnerSize(iframe: HTMLIFrameElement) {
  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) {
    return null;
  }

  return getDocumentInnerSize(iframeDocument);
}
