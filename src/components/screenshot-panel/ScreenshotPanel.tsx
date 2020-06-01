import React, { useCallback, useState } from 'react';
import {
  useStoryScreenshotLoader,
  useStoryScreenshotImageDiff,
  useDeleteStoryScreenshot,
} from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, SnackbarWithRetry } from '../common';
import { ScreenshotData } from '../../typings';
import { ScreenshotListToolbar } from './ScreenshotListToolbar';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotPreviewDialog } from './ScreenshotPreviewDialog';
import { ScreenshotList } from './ScreenshotList';

const ScreenshotPanel = () => {
  const [showPreview, setShowPreview] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ScreenshotData>();
  const [updateStoryScreenshots, setUpdateStoryScreenshots] = useState(false);

  const {
    loading,
    error,
    clearError,
    doRetry,
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

  const toggleSelectedItem = useCallback((data?: ScreenshotData) => {
    setSelectedItem(data);
  }, []);

  const toggleStoryUpdateClick = useCallback(() => {
    setUpdateStoryScreenshots(!updateStoryScreenshots);
  }, [updateStoryScreenshots]);

  const hasScreenshot = state.screenshots && state.screenshots.length > 0;

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
        <Loader open={loading || imageDiffTestInProgress || deleteInProgress} />
      </ScreenshotList>

      {error && (
        <SnackbarWithRetry
          type="error"
          open={true}
          onClose={clearError}
          message={error}
          onRetry={doRetry}
        />
      )}
      {storyImageDiffError && (
        <SnackbarWithRetry
          open={true}
          onRetry={testStoryScreenShots}
          type="error"
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
      {selectedItem && (
        <ScreenshotPreviewDialog
          screenShotData={selectedItem}
          storyData={storyData}
          onClose={toggleSelectedItem}
          open={true}
          width="100%"
          height="100%"
        />
      )}
      <DeleteScreenshotsErrorSnackbar />
      <SuccessSnackbarDeleteScreenshots message="Story screenshots deleted successfully." />
    </>
  );
};

ScreenshotPanel.displayName = 'ScreenshotPanel';

export { ScreenshotPanel };
