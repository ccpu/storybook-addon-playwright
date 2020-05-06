import React, { SFC, memo } from 'react';
import { Popover, PopoverProps } from '@material-ui/core';
import { ActionPanelProps, ActionPanel } from './ActionPanel';

export interface ActionPopoverProps extends ActionPanelProps, PopoverProps {}

const ActionPopover: SFC<ActionPopoverProps> = memo(
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
