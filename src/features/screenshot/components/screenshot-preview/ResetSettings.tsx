import { Tooltip } from '@material-ui/core';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { IconButton } from '@storybook/components';
import React from 'react';
import { useBrowserOptions, useScreenshotOptions } from '../../../../hooks';
import { resolveMuiIcon } from '../../../../utils/resolve-mui-icon';

const RotateLeftIconComponent = resolveMuiIcon(RotateLeftIcon);

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
        <RotateLeftIconComponent style={{ marginTop: 4, width: '20px' }} />
      </Tooltip>
    </IconButton>
  );
}

ResetSettings.displayName = 'ResetSettings';

export { ResetSettings };
