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
  const isNote = typeof title === 'string';
  const tooltip = isNote ? <TooltipNote note={title} /> : title;

  return (
    <WithTooltip
      as="span"
      trigger="hover"
      // `TooltipNote` already renders its own (dark) chrome, so disable
      // WithTooltip's outer chrome to avoid a box-within-a-box (a bordered
      // light popover wrapping the dark note). A non-string node keeps chrome.
      hasChrome={!isNote}
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
