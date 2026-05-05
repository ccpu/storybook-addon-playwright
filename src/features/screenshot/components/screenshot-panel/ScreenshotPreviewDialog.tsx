import React, { useEffect, useCallback } from 'react';
import { ScreenshotData } from '../../../../typings';
import {
  ImageDiffPreviewDialog,
  Loader,
  DialogProps,
  ImageDiffPreviewProps,
} from '../../../../components/common';
import { trpcClient } from '../../../../api/trpc/client';
import { ImageDiffResult } from '../../../../api/typings';
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
  const { storyData, screenShotData, onClose, open = true, ...rest } = props;

  const {
    mutateAsync,
    data: result,
    isPending: inProgress,
    reset,
  } = trpcClient.screenshot.testScreenshot.useMutation();

  useEffect(() => {
    mutateAsync({
      filePath: storyData.filePath,
      screenshotId: screenShotData.id,
      storyId: storyData.id,
    }).catch(() => undefined);
  }, [mutateAsync, screenShotData.id, storyData.id, storyData.filePath]);

  const handleClose = useCallback(() => {
    reset();
    onClose?.();
  }, [onClose, reset]);

  return (
    <>
      {(result as ImageDiffResult | undefined)?.filePath && (
        <ImageDiffPreviewDialog
          title={screenShotData.title}
          imageDiffResult={result as ImageDiffResult}
          open={open}
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
    </>
  );
};

ScreenshotPreviewDialog.displayName = 'ScreenshotPreviewDialog';

export { ScreenshotPreviewDialog };
