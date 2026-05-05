import React, { useCallback, useEffect } from 'react';
import { ScreenshotData } from '../../../../typings';
import Update from '@material-ui/icons/Update';
import { IconButton, Button } from '@material-ui/core';
import { useCurrentStoryData } from '../../../../hooks';
import { useScreenshotUpdate } from '../../hooks/use-screenshot-update';
import { trpcClient } from '../../../../api/trpc/client';
import { Loader, ImageDiffPreviewDialog } from '../../../../components/common';
import { ScreenshotInfo } from './ScreenshotInfo';
import { ImageDiffResult } from '../../../../api/typings';

export interface ScreenshotUpdateProps {
  screenshot: ScreenshotData;
  onStateChange: (state: boolean) => void;
  imageDiffResult?: ImageDiffResult;
}

const ScreenshotUpdate: React.FC<ScreenshotUpdateProps> = (props) => {
  const { screenshot, onStateChange, imageDiffResult } = props;

  const storyData = useCurrentStoryData();

  const { updateScreenshot, updateScreenshotInProgress } = useScreenshotUpdate(
    'Successfully updated.',
  );

  const {
    mutateAsync: testScreenshot,
    isPending: testScreenshotInProgress,
    reset: testScreenshotClearResult,
    data: testScreenshotResult,
  } = trpcClient.screenshot.testScreenshot.useMutation();

  const handleUpdate = useCallback(async () => {
    if (imageDiffResult) {
      await updateScreenshot(imageDiffResult);
    } else {
      if (!storyData) return;

      await testScreenshot({
        filePath: storyData.filePath,
        screenshotId: screenshot.id,
        storyId: storyData.id,
      });
    }
  }, [
    imageDiffResult,
    screenshot.id,
    storyData,
    testScreenshot,
    updateScreenshot,
  ]);

  const handleSaveScreenshotClick = useCallback(async () => {
    if (!testScreenshotResult) return;

    await updateScreenshot(testScreenshotResult);
    testScreenshotClearResult();
  }, [testScreenshotClearResult, testScreenshotResult, updateScreenshot]);

  useEffect(() => {
    onStateChange(testScreenshotInProgress || updateScreenshotInProgress);
  }, [testScreenshotInProgress, onStateChange, updateScreenshotInProgress]);

  return (
    <>
      <IconButton onClick={handleUpdate} size="small" title="Update screenshot">
        <Update />
      </IconButton>
      {testScreenshotResult && (
        <ImageDiffPreviewDialog
          title="Following screenshot will be saved, would you like to continue?"
          subtitle={screenshot.title}
          imageDiffResult={testScreenshotResult}
          onClose={testScreenshotClearResult}
          open={true}
          titleActions={() => (
            <ScreenshotInfo
              color="primary"
              size="medium"
              screenshotData={screenshot}
            />
          )}
          footerActions={() => (
            <>
              <Button onClick={testScreenshotClearResult} color="primary">
                No
              </Button>
              <Button
                onClick={handleSaveScreenshotClick}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </>
          )}
        />
      )}
      <Loader open={updateScreenshotInProgress} />
    </>
  );
};

ScreenshotUpdate.displayName = 'ScreenshotUpdate';

export { ScreenshotUpdate };
