import React from 'react';
import { ScreenshotTestTargetType } from '../../typings';
import { IconButton } from '@storybook/components';
import { Loader } from '../common';
import { useScreenshotUpdateState } from '../../features/screenshot/hooks/use-screenshot-update-state';
import { RefreshIcon } from '@storybook/icons';

export interface ScreenshotUpdateIconProps {
  target: ScreenshotTestTargetType;
}

const ScreenshotUpdateIcon: React.FC<ScreenshotUpdateIconProps> = ({
  target,
}) => {
  const reqBy = 'tool-' + target;

  const { runDiffTest, updateInf } = useScreenshotUpdateState(reqBy, target);

  const title =
    target == 'file'
      ? 'Update current story file screenshots'
      : 'Update all screen shots';

  return (
    <IconButton
      title={title}
      onClick={runDiffTest}
      style={{ position: 'relative' }}
      disabled={Boolean(updateInf.inProgress)}
    >
      <RefreshIcon />
      <Loader
        position="absolute"
        open={updateInf.reqBy === reqBy && Boolean(updateInf.inProgress)}
        progressSize={15}
      />
    </IconButton>
  );
};

ScreenshotUpdateIcon.displayName = 'ScreenshotUpdateIcon';

export { ScreenshotUpdateIcon };
