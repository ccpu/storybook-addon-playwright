import React, { useCallback, useState, SFC } from 'react';
import { useStoryScreenshotImageDiff, useCurrentStoryData } from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, SnackbarWithRetry } from '../common';
import { SortableScreenshotListItem } from './ScreenshotListItem';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotListSortable } from './ScreenshotListSortable';

const ScreenshotList: SFC = ({ children }) => {
  const [showPreview, setShowPreview] = useState(false);

  const [updateStoryScreenshots, setUpdateStoryScreenshots] = useState(false);

  const storyData = useCurrentStoryData();

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

  return (
    <>
      <ScreenshotListSortable>
        {hasScreenshot ? (
          <>
            {state.screenshots
              .sort((a, b) => a.index - b.index)
              .map((screenshot, index) => (
                <SortableScreenshotListItem
                  index={index}
                  openUpdateDialog={true}
                  key={screenshot.hash}
                  screenshot={screenshot}
                  storyData={storyData}
                  showPreviewOnClick={true}
                  draggable={true}
                  enableImageDiff={true}
                  enableUpdate={true}
                  showImageDiffResultDialog={true}
                  enableLoadSetting={true}
                  enableEditScreenshot={true}
                  pauseDeleteImageDiffResult={state.pauseDeleteImageDiffResult}
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
        <Loader open={imageDiffTestInProgress} />
        {children}
      </ScreenshotListSortable>

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
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
