import React, { useCallback, useMemo } from 'react';
import CameraIcon from '@material-ui/icons/Camera';
import { useScreenshotOptions } from '../../hooks';
import { OptionPopover } from './OptionPopover';
import { MemoizedSchemaFormLoader } from '../common';

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
      Icon={CameraIcon}
      active={isActive}
    >
      <MemoizedSchemaFormLoader
        onSave={handleSave}
        schemaName={'screenshot-options'}
        defaultData={screenshotOptions}
        excludeProps={['path']}
      />
    </OptionPopover>
  );
};

ScreenshotOptions.displayName = 'ScreenshotOptions';

export { ScreenshotOptions };
