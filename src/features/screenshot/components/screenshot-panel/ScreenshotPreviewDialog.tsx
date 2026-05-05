import React, { useEffect } from 'react';
import { ScreenshotData } from '../../../../typings';
import {
  ImageDiffPreviewDialog,
  Loader,
  DialogProps,
  ImageDiffPreviewProps,
} from '../../../../components/common';
import { ImageDiffResult } from '../../../../api/typings';
import { ScreenshotInfo } from './ScreenshotInfo';
import { StoryData } from '../../../../schema';
import { useScreenshotDiffTest } from '../../hooks';

export interface ScreenshotPreviewDialogProps
  extends DialogProps,
    Partial<ImageDiffPreviewProps> {
  screenShotData: ScreenshotData;
  storyData: StoryData;
}

const ScreenshotPreviewDialog: React.FC<ScreenshotPreviewDialogProps> = (
  props,
) => {
  const { storyData, screenShotData, onClose, open = true, ...rest } = props;

  const { testScreenshot, inProgress, result } = useScreenshotDiffTest();

  useEffect(() => {
    testScreenshot({ ...storyData, screenshotId: screenShotData.id });
  }, [storyData, screenShotData.id, testScreenshot]);

  return (
    <>
      {(result as ImageDiffResult | undefined)?.filePath && (
        <ImageDiffPreviewDialog
          title={screenShotData.title}
          imageDiffResult={result as ImageDiffResult}
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
