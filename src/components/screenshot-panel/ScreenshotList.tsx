import React, { SFC, useCallback, useState } from 'react';
import {
  useStoryScreenshotLoader,
  useDeleteScreenshot,
  useStoryScreenshotImageDiff,
} from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, SnackbarWithRetry, ListWrapper } from '../common';
import { ScreenshotData } from '../../typings';
import { ScreenshotListItem } from './ScreenshotListItem';
import { ScreenshotListToolbar } from './ScreenshotListToolbar';
import { ScreenshotListView } from './ScreenshotListView';

const ScreenshotList: SFC = () => {
  const [showPreview, setShowPreview] = useState(false);

  const [selectedItem, setSelectedItem] = useState<string>();

  const {
    loading,
    error,
    clearError,
    doRetry,
    storyData,
  } = useStoryScreenshotLoader();

  const state = useScreenshotContext();

  const {
    deleteScreenshot,
    error: deleteError,
    inProgress: deleteLoading,
    clearError: deleteClearError,
  } = useDeleteScreenshot();

  const handleDelete = useCallback(
    (screenshot: ScreenshotData) => {
      deleteScreenshot(screenshot.hash);
    },
    [deleteScreenshot],
  );

  const {
    testStoryScreenShots,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
  } = useStoryScreenshotImageDiff(storyData);

  const toggleShowPreview = useCallback(() => {
    setShowPreview(!showPreview);
    setSelectedItem(undefined);
  }, [showPreview]);

  const handleItemClick = useCallback((data: ScreenshotData) => {
    setShowPreview(true);
    setSelectedItem(data.hash);
  }, []);

  return (
    <>
      <ScreenshotListToolbar
        title="Story Screenshots"
        onTestClick={testStoryScreenShots}
        onPreviewClick={toggleShowPreview}
      />
      <ListWrapper>
        {state && state.screenshots && (
          <>
            {state.screenshots.map((screenshot) => (
              <ScreenshotListItem
                key={screenshot.hash}
                screenshot={screenshot}
                onDelete={handleDelete}
                storyInput={storyData}
                onClick={handleItemClick}
                imageDiffResult={state.imageDiffResults.find(
                  (x) =>
                    x.storyId === storyData.id &&
                    x.screenshotHash === screenshot.hash,
                )}
              />
            ))}
            {showPreview && (
              <ScreenshotListView
                screenshots={state.screenshots}
                onClose={toggleShowPreview}
                open={true}
                storyData={storyData}
                selectedItem={selectedItem}
              />
            )}
          </>
        )}

        <Loader open={loading || deleteLoading || imageDiffTestInProgress} />
        {(error || deleteError) && (
          <SnackbarWithRetry
            type="error"
            open={true}
            onClose={deleteError ? deleteClearError : clearError}
            message={error || deleteError}
            onRetry={deleteError ? undefined : doRetry}
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
      </ListWrapper>
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
