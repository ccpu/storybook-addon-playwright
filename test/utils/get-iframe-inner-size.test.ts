import { getIframeInnerSize } from '../../src/utils/get-iframe-inner-size';

type BoxMetrics = {
  clientHeight: number;
  clientWidth: number;
  offsetHeight: number;
  offsetWidth: number;
  scrollHeight: number;
  scrollWidth: number;
};

function setBoxMetrics(element: Element, metrics: BoxMetrics) {
  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: metrics.clientHeight },
    clientWidth: { configurable: true, value: metrics.clientWidth },
    offsetHeight: { configurable: true, value: metrics.offsetHeight },
    offsetWidth: { configurable: true, value: metrics.offsetWidth },
    scrollHeight: { configurable: true, value: metrics.scrollHeight },
    scrollWidth: { configurable: true, value: metrics.scrollWidth },
  });
}

function setRect(element: Element, rect: Partial<DOMRect>) {
  const value = {
    x: rect.x ?? 0,
    y: rect.y ?? 0,
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    top: rect.top ?? 0,
    right: rect.right ?? 0,
    bottom: rect.bottom ?? 0,
    left: rect.left ?? 0,
    toJSON: () => ({}),
  } as DOMRect;

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => value,
  });
}

function attachDefaultView(targetDocument: Document) {
  const defaultView = {
    HTMLElement,
    SVGElement,
    getComputedStyle: () =>
      ({
        display: 'block',
        visibility: 'visible',
      }) as CSSStyleDeclaration,
    scrollX: 0,
    scrollY: 0,
  } as unknown as Window;

  Object.defineProperty(targetDocument, 'defaultView', {
    configurable: true,
    value: defaultView,
  });
}

describe('getIframeInnerSize', () => {
  it('should return null when iframe has no content document', () => {
    const iframe = document.createElement('iframe');

    Object.defineProperty(iframe, 'contentDocument', {
      configurable: true,
      value: null,
    });

    expect(getIframeInnerSize(iframe)).toBe(null);
  });

  it('should return document size from body and documentElement metrics', () => {
    const iframe = document.createElement('iframe');
    const iframeDocument = document.implementation.createHTMLDocument('iframe-doc');

    attachDefaultView(iframeDocument);

    setBoxMetrics(iframeDocument.body, {
      clientHeight: 100,
      clientWidth: 200,
      offsetHeight: 120,
      offsetWidth: 220,
      scrollHeight: 300,
      scrollWidth: 400,
    });

    setBoxMetrics(iframeDocument.documentElement, {
      clientHeight: 140,
      clientWidth: 250,
      offsetHeight: 160,
      offsetWidth: 260,
      scrollHeight: 280,
      scrollWidth: 380,
    });

    Object.defineProperty(iframe, 'contentDocument', {
      configurable: true,
      value: iframeDocument,
    });

    expect(getIframeInnerSize(iframe)).toEqual({
      height: 300,
      width: 400,
    });
  });

  it('should include nested iframe content size', () => {
    const iframe = document.createElement('iframe');
    const outerDocument = document.implementation.createHTMLDocument('outer-doc');
    const nestedDocument = document.implementation.createHTMLDocument('nested-doc');
    const nestedIframe = outerDocument.createElement('iframe');

    attachDefaultView(outerDocument);
    attachDefaultView(nestedDocument);

    outerDocument.body.appendChild(nestedIframe);

    setBoxMetrics(outerDocument.body, {
      clientHeight: 200,
      clientWidth: 200,
      offsetHeight: 200,
      offsetWidth: 200,
      scrollHeight: 200,
      scrollWidth: 200,
    });

    setBoxMetrics(outerDocument.documentElement, {
      clientHeight: 200,
      clientWidth: 200,
      offsetHeight: 200,
      offsetWidth: 200,
      scrollHeight: 200,
      scrollWidth: 200,
    });

    setBoxMetrics(nestedDocument.body, {
      clientHeight: 1000,
      clientWidth: 700,
      offsetHeight: 1000,
      offsetWidth: 700,
      scrollHeight: 1200,
      scrollWidth: 800,
    });

    setBoxMetrics(nestedDocument.documentElement, {
      clientHeight: 1000,
      clientWidth: 700,
      offsetHeight: 1000,
      offsetWidth: 700,
      scrollHeight: 1200,
      scrollWidth: 800,
    });

    setRect(nestedIframe, {
      bottom: 40,
      height: 20,
      left: 10,
      right: 20,
      top: 20,
      width: 10,
    });

    Object.defineProperty(nestedIframe, 'contentDocument', {
      configurable: true,
      value: nestedDocument,
    });

    Object.defineProperty(iframe, 'contentDocument', {
      configurable: true,
      value: outerDocument,
    });

    expect(getIframeInnerSize(iframe)).toEqual({
      height: 1220,
      width: 810,
    });
  });

  it('should include visible element bounds in size calculation', () => {
    const iframe = document.createElement('iframe');
    const iframeDocument = document.implementation.createHTMLDocument('iframe-doc');
    const overflowingElement = iframeDocument.createElement('div');

    attachDefaultView(iframeDocument);

    iframeDocument.body.appendChild(overflowingElement);

    setBoxMetrics(iframeDocument.body, {
      clientHeight: 100,
      clientWidth: 100,
      offsetHeight: 100,
      offsetWidth: 100,
      scrollHeight: 100,
      scrollWidth: 100,
    });

    setBoxMetrics(iframeDocument.documentElement, {
      clientHeight: 100,
      clientWidth: 100,
      offsetHeight: 100,
      offsetWidth: 100,
      scrollHeight: 100,
      scrollWidth: 100,
    });

    setRect(overflowingElement, {
      bottom: 910,
      height: 10,
      left: 0,
      right: 760,
      top: 900,
      width: 760,
    });

    Object.defineProperty(iframe, 'contentDocument', {
      configurable: true,
      value: iframeDocument,
    });

    expect(getIframeInnerSize(iframe)).toEqual({
      height: 910,
      width: 760,
    });
  });
});
