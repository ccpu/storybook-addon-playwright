import CameraIcon from '@material-ui/icons/Camera';
import React, { useCallback, useMemo } from 'react';
import { MemoizedSchemaFormLoader } from '../../../../components/common';
import { resolveMuiIcon } from '../../../../utils/resolve-mui-icon';
import { useScreenshotOptions } from '../../hooks/use-screenshot-options';
import { OptionPopover } from './OptionPopover';

const CameraIconComponent = resolveMuiIcon(CameraIcon);

const ScreenshotOptions: React.FC = () => {
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const handleSave = useCallback(
    (d) => {
      setScreenshotOptions(d);
    },
    [setScreenshotOptions],
  );

  const isActive = useMemo(
    () => screenshotOptions && Object.keys(screenshotOptions).length > 0,
    [screenshotOptions],
  );

  return (
    <OptionPopover
      title="Screenshot Options"
      Icon={CameraIconComponent}
      active={isActive}
    >
      <MemoizedSchemaFormLoader
        onSave={handleSave}
        schemaName="screenshot-options"
        defaultData={screenshotOptions}
        excludeProps={['path']}
      />
    </OptionPopover>
  );
};

ScreenshotOptions.displayName = 'ScreenshotOptions';

export { ScreenshotOptions };
