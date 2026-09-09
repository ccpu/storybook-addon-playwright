import { RotateLeft as RotateLeftIcon } from '../../../../icons';
import { IconButton } from '../../../../components/common/IconButton';
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
    <IconButton onClick={handleClick} title="Reset Settings">
      <RotateLeftIconComponent style={{ marginTop: 4, width: '20px' }} />
    </IconButton>
  );
}

ResetSettings.displayName = 'ResetSettings';

export { ResetSettings };
