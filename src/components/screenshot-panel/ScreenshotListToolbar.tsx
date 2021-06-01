import React from 'react';
import { Toolbar } from '../common';
import Compare from '@material-ui/icons/Compare';
import { IconButton } from '@storybook/components';
import Visibility from '@material-ui/icons/Visibility';
import Update from '@material-ui/icons/Update';
import { DeleteConfirmationButton, FixScreenshotFileDialog } from '../common';

export interface ScreenshotListToolbarProps {
  onTestClick: () => void;
  title: string;
  onPreviewClick: () => void;
  onUpdateClick: () => void;
  hasScreenShot?: boolean;
  onDelete: () => void;
}

const ScreenshotListToolbar: React.FC<ScreenshotListToolbarProps> = (props) => {
  const {
    hasScreenShot,
    title,
    onTestClick,
    onPreviewClick,
    onUpdateClick,
    onDelete,
  } = props;

  return (
    <Toolbar border={['bottom']}>
      <div className="left">
        <div title={title}>Story Screenshots</div>
      </div>
      <div className="right">
        <FixScreenshotFileDialog fixFunction={true} />
        {hasScreenShot && (
          <>
            <IconButton
              onClick={onUpdateClick}
              title="Update story screenshots"
            >
              <Update />
            </IconButton>
            <IconButton
              onClick={onTestClick}
              title="Run diff test for story screenshots"
            >
              <Compare viewBox="0 -1 27 27" />
            </IconButton>
            <IconButton
              onClick={onPreviewClick}
              title="Display story screenshots"
            >
              <Visibility />
            </IconButton>
            <DeleteConfirmationButton
              IconButton={IconButton}
              onDelete={onDelete}
            />
          </>
        )}
      </div>
    </Toolbar>
  );
};

ScreenshotListToolbar.displayName = 'ScreenshotListToolbar';

export { ScreenshotListToolbar };
