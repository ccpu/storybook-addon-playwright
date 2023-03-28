import React from 'react';
import { IconButton } from '@storybook/components';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { Tooltip } from '@material-ui/core';
import { useBrowserOptions, useScreenshotOptions } from '../../hooks';

const ResetSettings = () => {
  const { setBrowserOptions } = useBrowserOptions();
  const { setScreenshotOptions } = useScreenshotOptions();

  const handleClick = React.useCallback(() => {
    setBrowserOptions('all', {});
    setScreenshotOptions({});
  }, [setBrowserOptions, setScreenshotOptions]);

  return (
    <IconButton onClick={handleClick}>
      <Tooltip placement="top" title={'Reset Settings'}>
        <RotateLeftIcon style={{ marginTop: 4, width: '20px' }} />
      </Tooltip>
    </IconButton>
  );
};

ResetSettings.displayName = 'ResetSettings';

export { ResetSettings };
