import React, { SFC, useCallback } from 'react';
import CameraIcon from '@material-ui/icons/Camera';
import { useScreenshotOptions } from '../../hooks';
import { OptionPopover } from './OptionPopover';
import { MemoizedSchemaFormLoader } from '../common';

const ScreenshotOptions: SFC = () => {
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const handleSave = useCallback(
    (d) => {
      setScreenshotOptions(d);
    },
    [setScreenshotOptions],
  );

  return (
    <OptionPopover title="Screenshot Options" Icon={CameraIcon}>
      <MemoizedSchemaFormLoader
        onSave={handleSave}
        type={'ScreenshotOptions'}
        defaultData={screenshotOptions}
        excludeProps={['path']}
      />
    </OptionPopover>
  );
};

ScreenshotOptions.displayName = 'ScreenshotOptions';

export { ScreenshotOptions };
