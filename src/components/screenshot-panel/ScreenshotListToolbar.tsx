import React, { SFC } from 'react';
import { Toolbar } from '../common';
import Compare from '@material-ui/icons/Compare';
import { IconButton } from '@storybook/components';
import Visibility from '@material-ui/icons/Visibility';
import Update from '@material-ui/icons/Update';

export interface ScreenshotListToolbarProps {
  onTestClick: () => void;
  title: string;
  onPreviewClick: () => void;
  onUpdateClick: () => void;
  hasScreenShot?: boolean;
}

const ScreenshotListToolbar: SFC<ScreenshotListToolbarProps> = (props) => {
  const {
    hasScreenShot,
    title,
    onTestClick,
    onPreviewClick,
    onUpdateClick,
  } = props;
  if (!hasScreenShot) return null;
  return (
    <Toolbar border={['bottom']}>
      <div className="left">
        <div title={title}>Story Screenshots</div>
      </div>
      <div className="right">
        <IconButton onClick={onUpdateClick} title="Update story screenshots">
          <Update />
        </IconButton>
        <IconButton
          onClick={onTestClick}
          title="Run diff test for story screenshots"
        >
          <Compare viewBox="0 -1 27 27" />
        </IconButton>
        <IconButton onClick={onPreviewClick} title="Display story screenshots">
          <Visibility />
        </IconButton>
      </div>
    </Toolbar>
  );
};

ScreenshotListToolbar.displayName = 'ScreenshotListToolbar';

export { ScreenshotListToolbar };
