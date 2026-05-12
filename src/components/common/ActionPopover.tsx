import type { PopoverProps } from '@material-ui/core';
import type { ActionPanelProps } from './ActionPanel';
import { Popover } from '@material-ui/core';
import React, { memo } from 'react';
import { ActionPanel } from './ActionPanel';

export interface ActionPopoverProps
  extends ActionPanelProps, Omit<PopoverProps, 'open' | 'onClose'> {
  onClose?: PopoverProps['onClose'];
}

const ActionPopover: React.FC<ActionPopoverProps> = memo(
  ({
    onPositiveAction,
    title,
    onNegativeAction,
    children,
    positiveActionName,
    negativeActionName,
    ...rest
  }) => {
    return (
      <Popover open={true} {...rest}>
        <ActionPanel
          onPositiveAction={onPositiveAction}
          negativeActionName={negativeActionName}
          title={title}
          onNegativeAction={onNegativeAction}
          positiveActionName={positiveActionName}
        >
          {children}
        </ActionPanel>
      </Popover>
    );
  },
);

ActionPopover.displayName = 'ActionPopover';

export { ActionPopover };
