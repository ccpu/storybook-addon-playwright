import { TooltipNote, WithTooltip } from '@storybook/components';
import React from 'react';

type WithTooltipProps = React.ComponentProps<typeof WithTooltip>;

export interface TooltipProps extends Omit<WithTooltipProps, 'tooltip' | 'title'> {
  /**
   * Tooltip content. Strings render as a Storybook `TooltipNote`; any other
   * node is rendered as-is inside the tooltip chrome.
   */
  title: React.ReactNode;
  /** MUI-compatible alias for `delayShow` (ms to wait before showing). */
  enterDelay?: number;
  children: React.ReactNode;
}

/**
 * Reusable tooltip built on top of `@storybook/components`' `WithTooltip`,
 * exposing a small MUI-`Tooltip`-compatible API (`title`, `placement`,
 * `enterDelay`) so it can be dropped in wherever the old `@mui/material`
 * `Tooltip` was used.
 */
const Tooltip: React.FC<TooltipProps> = ({
  title,
  enterDelay,
  placement = 'top',
  delayShow,
  children,
  ...props
}) => {
  const tooltip = typeof title === 'string' ? <TooltipNote note={title} /> : title;

  return (
    <WithTooltip
      as="span"
      trigger="hover"
      {...props}
      placement={placement}
      delayShow={delayShow ?? enterDelay}
      tooltip={tooltip}
    >
      {children}
    </WithTooltip>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
