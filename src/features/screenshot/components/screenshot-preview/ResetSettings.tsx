import { Tooltip } from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { IconButton } from '@storybook/components';
import React from 'react';
import { useBrowserOptions, useScreenshotOptions } from '../../../../hooks';

function ResetSettings() {
  const { setBrowserOptions } = useBrowserOptions();
  const { setScreenshotOptions } = useScreenshotOptions();

  const handleClick = React.useCallback(() => {
    setBrowserOptions('all', {});
    setScreenshotOptions({});
  }, [setBrowserOptions, setScreenshotOptions]);

  return (
    <IconButton onClick={handleClick}>
      <Tooltip placement="top" title="Reset Settings">
        <RotateLeftIcon style={{ marginTop: 4, width: '20px' }} />
      </Tooltip>
    </IconButton>
  );
}

ResetSettings.displayName = 'ResetSettings';

export { ResetSettings };
