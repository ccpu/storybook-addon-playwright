import { Button } from 'storybook/internal/components';
import React, { memo } from 'react';
import { DialogActions } from './DialogActions';
import { DialogContent } from './DialogContent';
import { DialogTitle } from './DialogTitle';

export interface ActionPanelProps {
  title?: string;
  onPositiveAction?: () => void;
  onNegativeAction?: () => void;
  positiveActionName?: string;
  negativeActionName?: string;
}

const ActionPanel: React.FC<ActionPanelProps> = memo(
  ({
    onPositiveAction,
    title,
    onNegativeAction,
    children,
    positiveActionName = 'Save',
    negativeActionName = 'Cancel',
  }) => {
    return (
      <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onNegativeAction}>{negativeActionName}</Button>
          <Button onClick={onPositiveAction}>{positiveActionName}</Button>
        </DialogActions>
      </>
    );
  },
);

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
