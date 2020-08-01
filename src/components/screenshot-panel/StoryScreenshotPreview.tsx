import React, { SFC, useCallback, useState } from 'react';
import { ScreenshotData, StoryData } from '../../typings';
import { useStoryScreenshotsDiff, useScreenshotUpdate } from '../../hooks';
import { Loader, Snackbar } from '../common';
import { ScreenshotListPreviewDialog } from './ScreenshotListPreviewDialog';
import { Button } from '@material-ui/core';
import { useScreenshotContext } from '../../store/screenshot';

export interface StoryScreenshotPreviewProps {
  screenshotsData: ScreenshotData[];
  onFinish: () => void;
  storyData: StoryData;
  updating?: boolean;
}

const StoryScreenshotPreview: SFC<StoryScreenshotPreviewProps> = (props) => {
  const { screenshotsData, storyData, onFinish, updating } = props;

  const { loading } = useStoryScreenshotsDiff(storyData);

  const [updateInProgress, setUpdateInProgress] = useState(false);

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);

  const state = useScreenshotContext();

  const { updateScreenshot } = useScreenshotUpdate();

  const handleSave = useCallback(async () => {
    setUpdateInProgress(true);
    try {
      const promises = screenshotsData.map((s) => {
        const imageDiffResult = state.imageDiffResults.find(
          (x) => x.screenshotId === s.id,
        );
        if (!imageDiffResult) {
          throw new Error(
            `Unable to find image diff result for '${s.title}' screenshot.`,
          );
        }
        updateScreenshot(imageDiffResult);
      });

      await Promise.all(promises);
      setSuccess(true);
      setOpenDialog(false);
    } catch (error) {
      setError(error.message);
    }
    setUpdateInProgress(false);
  }, [screenshotsData, state.imageDiffResults, updateScreenshot]);

  const handleErrorClose = useCallback(() => {
    setError(undefined);
  }, []);

  return (
    <>
      <Loader open={loading} />
      {!loading && (
        <ScreenshotListPreviewDialog
          title={
            updating &&
            'Following screenshots will be saved, would you like to continue?'
          }
          screenshots={screenshotsData}
          onClose={onFinish}
          open={openDialog}
          storyData={storyData}
          footerActions={
            updating &&
            (() => (
              <>
                <Button onClick={onFinish} color="primary">
                  No
                </Button>
                <Button onClick={handleSave} color="primary" autoFocus>
                  Yes
                </Button>
              </>
            ))
          }
        >
          <Loader open={updateInProgress} />
        </ScreenshotListPreviewDialog>
      )}
      <Snackbar
        variant="success"
        message="Story screenshots updates successfully."
        open={success}
        onClose={onFinish}
        autoHideDuration={4000}
      />

      <Snackbar
        variant="error"
        title="Error"
        message={error}
        open={Boolean(error)}
        onClose={handleErrorClose}
      />
    </>
  );
};

StoryScreenshotPreview.displayName = 'StoryScreenshotPreview';

export { StoryScreenshotPreview };
