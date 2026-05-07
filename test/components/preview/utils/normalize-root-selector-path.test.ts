import { normalizeRootSelectorPath } from '../../../../src/components/preview/utils/normalize-root-selector-path';

const appendDiv = (id?: string): HTMLDivElement => {
  const element = document.createElement('div');
  if (id) element.id = id;
  document.body.appendChild(element);
  return element;
};

describe('normalizeRootSelectorPath', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should replace legacy selector with #root when they reference the same element', () => {
    appendDiv();
    appendDiv();
    appendDiv('root');

    expect(
      normalizeRootSelectorPath(
        'html>body>div:nth-child(3)>button:nth-child(1)',
        document,
      ),
    ).toBe('html>body>#root>button:nth-child(1)');
  });

  it('should use #storybook-root when #root does not exist', () => {
    appendDiv();
    appendDiv('storybook-root');

    expect(normalizeRootSelectorPath('html>body>div:nth-child(2)>span', document)).toBe(
      'html>body>#storybook-root>span',
    );
  });

  it('should not replace when no supported root selector exists', () => {
    appendDiv();
    appendDiv();
    appendDiv();

    expect(normalizeRootSelectorPath('html>body>div:nth-child(3)>span', document)).toBe(
      'html>body>div:nth-child(3)>span',
    );
  });

  it('should not replace when nth-child selector does not point to the root element', () => {
    appendDiv();
    appendDiv('root');

    expect(normalizeRootSelectorPath('html>body>div:nth-child(1)>span', document)).toBe(
      'html>body>div:nth-child(1)>span',
    );
  });

  it('should evaluate legacy selectors up to nth-child(8)', () => {
    for (let index = 1; index <= 7; index += 1) {
      appendDiv();
    }
    appendDiv('root');

    expect(normalizeRootSelectorPath('html>body>div:nth-child(8)>span', document)).toBe(
      'html>body>#root>span',
    );
  });

  it('should not replace selectors outside nth-child(1..8)', () => {
    for (let index = 1; index <= 8; index += 1) {
      appendDiv();
    }
    appendDiv('root');

    expect(normalizeRootSelectorPath('html>body>div:nth-child(9)>span', document)).toBe(
      'html>body>div:nth-child(9)>span',
    );
  });
});
