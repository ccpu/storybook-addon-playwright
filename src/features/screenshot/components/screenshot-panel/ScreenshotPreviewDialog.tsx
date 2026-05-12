import type { DialogProps, ImageDiffPreviewProps } from '../../../../components/common';
import type { StoryData } from '../../../../schema';
import type { ScreenshotData } from '../../../../typings';
import React, { useEffect } from 'react';
import { ImageDiffPreviewDialog, Loader } from '../../../../components/common';
import { useScreenshotDiffTest } from '../../hooks';
import { ScreenshotInfo } from './ScreenshotInfo';

export interface ScreenshotPreviewDialogProps
  extends DialogProps, Partial<ImageDiffPreviewProps> {
  screenShotData: ScreenshotData;
  storyData: StoryData;
}

const ScreenshotPreviewDialog: React.FC<ScreenshotPreviewDialogProps> = (props) => {
  const { storyData, screenShotData, onClose, open = true, ...rest } = props;

  const { testScreenshot, inProgress, result } = useScreenshotDiffTest();

  useEffect(() => {
    testScreenshot({ ...storyData, screenshotId: screenShotData.id });
  }, [storyData, screenShotData.id, testScreenshot]);

  return (
    <>
      {result?.filePath && (
        <ImageDiffPreviewDialog
          title={screenShotData.title}
          imageDiffResult={result}
          open={open}
          onClose={onClose}
          titleActions={() => (
            <ScreenshotInfo
              color="primary"
              size="medium"
              screenshotData={screenShotData}
            />
          )}
          {...rest}
        />
      )}
      <Loader open={inProgress} />
    </>
  );
};

ScreenshotPreviewDialog.displayName = 'ScreenshotPreviewDialog';

export { ScreenshotPreviewDialog };
