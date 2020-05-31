import React, { SFC, useCallback, useState } from 'react';
import {
  useStoryScreenshotLoader,
  useStoryScreenshotImageDiff,
} from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, SnackbarWithRetry, ListWrapper } from '../common';
import { ScreenshotData } from '../../typings';
import { ScreenshotListItem } from './ScreenshotListItem';
import { ScreenshotListToolbar } from './ScreenshotListToolbar';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotPreviewDialog } from './ScreenshotPreviewDialog';

const ScreenshotList: SFC = () => {
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
      />
      <ListWrapper>
        {state && state.screenshots ? (
          <>
            {state.screenshots.map((screenshot) => (
              <ScreenshotListItem
                key={screenshot.hash}
                screenshot={screenshot}
                storyInput={storyData}
                onClick={toggleSelectedItem}
                deletePassedImageDiffResult={
                  !updateStoryScreenshots && !showPreview
                }
                showSuccessImageDiff={true}
                enableImageDiff={true}
                enableUpdate={true}
                showImageDiffResultDialog={true}
                imageDiffResult={state.imageDiffResults.find(
                  (x) =>
                    x.storyId === storyData.id &&
                    x.screenshotHash === screenshot.hash,
                )}
              />
            ))}
          </>
        ) : (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <div> No screenshot has been found!</div>
          </div>
        )}
        <Loader open={loading || imageDiffTestInProgress} />
      </ListWrapper>

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
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
