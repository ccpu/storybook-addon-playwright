import React, { useCallback, useState, useEffect } from 'react';
import {
  useStoryScreenshotLoader,
  useStoryScreenshotImageDiff,
  useDeleteStoryScreenshot,
} from '../../hooks';
import {
  useScreenshotContext,
  useScreenshotDispatch,
} from '../../store/screenshot';
import { Loader, Snackbar } from '../common';
import { ScreenshotListToolbar } from './ScreenshotListToolbar';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotList } from './ScreenshotList';
import { Button } from '@material-ui/core';

const ScreenshotPanel = () => {
  const [showPreview, setShowPreview] = useState(false);

  const [updateStoryScreenshots, setUpdateStoryScreenshots] = useState(false);

  const dispatch = useScreenshotDispatch();

  const {
    ScreenshotLoaderErrorSnackbar,
    loadScreenShots,
    screenshotLoaderInProgress,
    storyData,
  } = useStoryScreenshotLoader();

  const {
    DeleteScreenshotsErrorSnackbar,
    SuccessSnackbarDeleteScreenshots,
    deleteInProgress,
    deleteStoryScreenshots,
  } = useDeleteStoryScreenshot();

  const state = useScreenshotContext();

  const {
    testStoryScreenShots,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
  } = useStoryScreenshotImageDiff(storyData);

  const toggleShowPreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const toggleStoryUpdateClick = useCallback(() => {
    setUpdateStoryScreenshots(!updateStoryScreenshots);
  }, [updateStoryScreenshots]);

  const hasScreenshot = state.screenshots && state.screenshots.length > 0;

  useEffect(() => {
    dispatch({
      state: showPreview || updateStoryScreenshots,
      type: 'pauseDeleteImageDiffResult',
    });
  }, [dispatch, showPreview, updateStoryScreenshots]);

  return (
    <>
      <ScreenshotListToolbar
        onUpdateClick={toggleStoryUpdateClick}
        title="Story Screenshots"
        onTestClick={testStoryScreenShots}
        onPreviewClick={toggleShowPreview}
        hasScreenShot={hasScreenshot}
        onDelete={deleteStoryScreenshots}
      />
      <ScreenshotList>
        <Loader
          open={
            screenshotLoaderInProgress ||
            imageDiffTestInProgress ||
            deleteInProgress
          }
        />
      </ScreenshotList>

      <ScreenshotLoaderErrorSnackbar onRetry={loadScreenShots} />

      {storyImageDiffError && (
        <Snackbar
          open={true}
          action={
            <Button color="inherit" onClick={testStoryScreenShots}>
              Retry
            </Button>
          }
          variant="error"
          message={storyImageDiffError}
          onClose={clearImageDiffError}
        />
      )}
      {(updateStoryScreenshots || showPreview) && (
        <StoryScreenshotPreview
          storyData={storyData}
          screenshotsData={state.screenshots}
          onFinish={showPreview ? toggleShowPreview : toggleStoryUpdateClick}
          updating={updateStoryScreenshots}
        />
      )}

      <DeleteScreenshotsErrorSnackbar />
      <SuccessSnackbarDeleteScreenshots message="Story screenshots deleted successfully." />
    </>
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
