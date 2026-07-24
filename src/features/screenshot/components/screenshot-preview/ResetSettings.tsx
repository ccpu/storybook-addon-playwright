import { RotateLeft as RotateLeftIcon } from '../../../../icons';
import { IconButton } from '@storybook/components';
import React from 'react';
import { Tooltip } from '../../../../components/common';
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
