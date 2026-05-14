import React from 'react';
import { render } from '@testing-library/react';
import { withReactMounted as withReactMountedFromRoot } from '../../decorator';
import { ReactMountedDecorator, withReactMounted } from '../../src/decorator';
import {
  STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
  STORYBOOK_BODY_MOUNTED_READY_VALUE,
} from '../../src/constants/decorator';

describe('ReactMountedDecorator', () => {
  beforeEach(() => {
    document.body.removeAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE);
  });

  it('should set mounted body marker and remove it on unmount', async () => {
    const { unmount } = render(
      <ReactMountedDecorator>
        <div>content</div>
      </ReactMountedDecorator>,
    );

    expect(document.body.getAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE)).toBe(
      STORYBOOK_BODY_MOUNTED_READY_VALUE,
    );

    unmount();

    expect(document.body.hasAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE)).toBe(false);
  });

  it('should support Storybook decorators via withReactMounted', () => {
    const decorator = withReactMounted();
    const DecoratedStory = decorator(() => <div>content</div>, {} as never);
    const { unmount } = render(<>{DecoratedStory}</>);

    expect(document.body.getAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE)).toBe(
      STORYBOOK_BODY_MOUNTED_READY_VALUE,
    );

    unmount();

    expect(document.body.hasAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE)).toBe(false);
  });

  it('should export withReactMounted from the package root decorator entry', () => {
    expect(typeof withReactMountedFromRoot).toBe('function');
  });
});
