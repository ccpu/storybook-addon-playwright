import type { ComponentProps } from 'react';
import { IconButton as StorybookIconButton } from 'storybook/internal/components';
import React, { forwardRef } from 'react';

export type IconButtonProps = ComponentProps<typeof StorybookIconButton>;

/**
 * Storybook 10 turned `IconButton` into a thin wrapper around `Button`, which
 * defaults to `variant="outline"` — a filled, bordered box. Storybook's own
 * bars render their icon buttons as `variant="ghost"` with `padding="small"`,
 * so mirror those defaults here to keep the addon consistent with the rest of
 * the manager UI (and to make the `active` state visible, which `outline`
 * swallows).
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', padding = 'small', ...props }, ref) => (
    <StorybookIconButton ref={ref} variant={variant} padding={padding} {...props} />
  ),
);

IconButton.displayName = 'IconButton';

export { IconButton };
