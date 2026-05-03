import React, { useCallback, useState, useEffect } from 'react';
import {
  useStoryScreenshotLoader,
  useScreenshotImageDiffResults,
  useDeleteStoryScreenshot,
  useScreenshotUpdateState,
} from '../../../../hooks';
import {
  useScreenshotStoreState,
  setPauseDeleteImageDiffResult,
} from '../../store/index';
import { Loader, Snackbar } from '../../../../components/common';
import { ScreenshotListToolbar } from './ScreenshotListToolbar';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotList } from './ScreenshotList';
import { Button } from '@material-ui/core';

const ScreenshotPanel = () => {
  const [showPreview, setShowPreview] = useState(false);

  const reqBy = 'screenshot-panel';
  const { runDiffTest, updateInf } = useScreenshotUpdateState(reqBy, 'story');

  const { screenshotLoaderInProgress } = useStoryScreenshotLoader();

  const { deleteInProgress, deleteStoryScreenshots } =
    useDeleteStoryScreenshot();

  const state = useScreenshotStoreState();

  const {
    testStoryScreenShots,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
  } = useScreenshotImageDiffResults();

  const toggleShowPreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const hasScreenshot = state.screenshots && state.screenshots.length > 0;

  useEffect(() => {
    setPauseDeleteImageDiffResult(showPreview);
  }, [showPreview]);

  const handleStoryImgDiff = React.useCallback(() => {
    testStoryScreenShots('story');
  }, [testStoryScreenShots]);

  return (
    <>
      <ScreenshotListToolbar
        onUpdateClick={runDiffTest}
        title="Story Screenshots"
        onTestClick={handleStoryImgDiff}
        onPreviewClick={toggleShowPreview}
        hasScreenShot={hasScreenshot}
        onDelete={deleteStoryScreenshots}
      />
      <ScreenshotList>
        <Loader
          open={
            screenshotLoaderInProgress ||
            imageDiffTestInProgress ||
            deleteInProgress ||
            updateInf.reqBy !== undefined
          }
        />
      </ScreenshotList>
      {storyImageDiffError && (
        <Snackbar
          open={true}
          action={
            <Button color="inherit" onClick={handleStoryImgDiff}>
              Retry
            </Button>
          }
          variant="error"
          message={storyImageDiffError}
          onClose={clearImageDiffError}
        />
      )}
      {showPreview && (
        <StoryScreenshotPreview onClose={toggleShowPreview} target="story" />
      )}
    </>
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
