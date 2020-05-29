import React, { SFC } from 'react';
import { Toolbar } from '../common';
import Compare from '@material-ui/icons/Compare';
import { IconButton } from '@storybook/components';
import Visibility from '@material-ui/icons/Visibility';

export interface ScreenshotListToolbarProps {
  onTestClick: () => void;
  title: string;
  onPreviewClick: () => void;
}

const ScreenshotListToolbar: SFC<ScreenshotListToolbarProps> = (props) => {
  const { title, onTestClick, onPreviewClick } = props;

  return (
    <Toolbar border={['bottom']}>
      <div className="left">
        <div title={title}>Story Screenshots</div>
      </div>
      <div className="right">
        <IconButton
          onClick={onTestClick}
          title="Run diff test for story screenshots"
        >
          <Compare viewBox="0 0 28 28" />
        </IconButton>
        <IconButton onClick={onPreviewClick}>
          <Visibility />
        </IconButton>
      </div>
    </Toolbar>
  );
};

ScreenshotListToolbar.displayName = 'ScreenshotListToolbar';

export { ScreenshotListToolbar };
