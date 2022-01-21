import React from 'react';
import { ScreenshotTestTargetType } from '../../typings';
import Update from '@mui/icons-material/Update';
import { IconButton } from '@storybook/components';
import { Loader } from '../common';
import { useScreenshotUpdateState } from '../../hooks/use-screenshot-update-state';

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
      disabled={updateInf.inProgress}
    >
      <Update viewBox="1.5 1 20 20" />
      <Loader
        position="absolute"
        open={updateInf.reqBy === reqBy && updateInf.inProgress}
        progressSize={15}
      />
    </IconButton>
  );
};

ScreenshotUpdateIcon.displayName = 'ScreenshotUpdateIcon';

export { ScreenshotUpdateIcon };
