import React, { useCallback, useState, SFC } from 'react';
import {
  useStoryScreenshotLoader,
  useStoryScreenshotImageDiff,
  useScreenshotIndexChange,
} from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import {
  Loader,
  SnackbarWithRetry,
  ListWrapperSortableContainer,
} from '../common';
import { ScreenshotData } from '../../typings';
import { SortableScreenshotListItem } from './ScreenshotListItem';
import { StoryScreenshotPreview } from './StoryScreenshotPreview';
import { ScreenshotPreviewDialog } from './ScreenshotPreviewDialog';
import { SortEnd } from 'react-sortable-hoc';

const ScreenshotList: SFC = ({ children }) => {
  const [showPreview, setShowPreview] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ScreenshotData>();
  const [updateStoryScreenshots, setUpdateStoryScreenshots] = useState(false);
  const [dragStart, setDragStart] = useState(false);

  const {
    loading,
    error,
    clearError,
    doRetry,
    storyData,
  } = useStoryScreenshotLoader();

  const {
    ChangeIndexErrorSnackbar,
    changeIndex,
    ChangeIndexInProgress,
  } = useScreenshotIndexChange();

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

  const handleDragStart = useCallback(() => {
    setDragStart(true);
  }, []);

  const handleDragEnd = useCallback(
    (e: SortEnd) => {
      setDragStart(false);
      changeIndex(e);
    },
    [changeIndex],
  );

  return (
    <>
      <ListWrapperSortableContainer
        useDragHandle
        onSortEnd={handleDragEnd}
        updateBeforeSortStart={handleDragStart}
      >
        {hasScreenshot ? (
          <>
            {state.screenshots
              .sort((a, b) => a.index - b.index)
              .map((screenshot, index) => (
                <SortableScreenshotListItem
                  index={index}
                  key={screenshot.hash}
                  screenshot={screenshot}
                  storyData={storyData}
                  onClick={toggleSelectedItem}
                  deletePassedImageDiffResult={
                    !updateStoryScreenshots && !showPreview
                  }
                  dragStart={dragStart}
                  draggable={true}
                  showSuccessImageDiff={true}
                  enableImageDiff={true}
                  enableUpdate={true}
                  showImageDiffResultDialog={true}
                  enableLoadSetting={true}
                  enableEditScreenshot={true}
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
        <Loader
          open={loading || imageDiffTestInProgress || ChangeIndexInProgress}
        />
        {children}
      </ListWrapperSortableContainer>

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
      <ChangeIndexErrorSnackbar />
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
