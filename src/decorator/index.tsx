import React from 'react';
import type { Renderer, DecoratorFunction } from 'storybook/internal/types';
import {
  STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
  STORYBOOK_BODY_MOUNTED_PENDING_VALUE,
  STORYBOOK_BODY_MOUNTED_READY_VALUE,
} from '../constants/decorator';

export interface ReactMountedDecoratorProps {
  children: React.ReactNode;
}

const ensurePendingMountedMarker = () => {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  if (!document.body.hasAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE)) {
    document.body.setAttribute(
      STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      STORYBOOK_BODY_MOUNTED_PENDING_VALUE,
    );
  }
};

export function ReactMountedDecorator({
  children,
}: ReactMountedDecoratorProps): JSX.Element {
  ensurePendingMountedMarker();

  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    document.body.setAttribute(
      STORYBOOK_BODY_MOUNTED_ATTRIBUTE,
      STORYBOOK_BODY_MOUNTED_READY_VALUE,
    );

    return () => {
      document.body.removeAttribute(STORYBOOK_BODY_MOUNTED_ATTRIBUTE);
    };
  }, []);

  return <>{children}</>;
}

export function withReactMounted<
  TRenderer extends Renderer = Renderer,
>(): DecoratorFunction<TRenderer> {
  return (Story, _context) => (
    <ReactMountedDecorator>
      <Story />
    </ReactMountedDecorator>
  );
}

// Alias retained for discoverability when users search with reversed name order.
export const MountedDecoratorReact = ReactMountedDecorator;

export * from '../constants/decorator';
