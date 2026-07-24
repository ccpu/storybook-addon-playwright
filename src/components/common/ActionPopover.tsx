import type { ActionPanelProps } from './ActionPanel';
import type { PopoverProps } from './Popover';
import React, { memo } from 'react';
import { ActionPanel } from './ActionPanel';
import { Popover } from './Popover';

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
