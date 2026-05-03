import React, { useEffect, useCallback } from 'react';
import { ScreenshotData } from '../../../../typings';
import { useAsyncApiCall } from '../../../../hooks';
import {
  ImageDiffPreviewDialog,
  Loader,
  DialogProps,
  ImageDiffPreviewProps,
} from '../../../../components/common';
import { testScreenshot } from '../../../../api/trpc/clients/screenshot.client';
import { ScreenshotInfo } from './ScreenshotInfo';
import { StoryData } from '../../../../schema';

export interface ScreenshotPreviewDialogProps
  extends DialogProps,
    Partial<ImageDiffPreviewProps> {
  screenShotData: ScreenshotData;
  storyData: StoryData;
}

const ScreenshotPreviewDialog: React.FC<ScreenshotPreviewDialogProps> = (
  props,
) => {
  const { storyData, screenShotData, onClose, ...rest } = props;

  const { makeCall, result, inProgress, clearResult, ErrorSnackbar } =
    useAsyncApiCall(testScreenshot);

  useEffect(() => {
    makeCall({
      fileName: storyData.parameters.fileName,
      filePath: storyData.importPath,
      screenshotId: screenShotData.id,
      storyId: storyData.id,
    });
  }, [
    makeCall,
    screenShotData.id,
    storyData.id,
    storyData.parameters.fileName,
    storyData.importPath,
  ]);

  const handleClose = useCallback(() => {
    clearResult();
    onClose();
  }, [clearResult, onClose]);

  return (
    <>
      {result && (
        <ImageDiffPreviewDialog
          title={screenShotData.title}
          imageDiffResult={result}
          open={true}
          onClose={handleClose}
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
      <ErrorSnackbar />
    </>
  );
};

ScreenshotPreviewDialog.displayName = 'ScreenshotPreviewDialog';

export { ScreenshotPreviewDialog };
