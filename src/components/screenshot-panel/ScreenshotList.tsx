import React, { SFC, useCallback } from 'react';
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

const ScreenshotList: SFC = () => {
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

  return (
    <>
      <ScreenshotListToolbar
        title="Story Screenshots"
        onTestClick={testStoryScreenShots}
      />
      <ListWrapper>
        {state &&
          state.screenshots &&
          state.screenshots.map((screenshot) => (
            <ScreenshotListItem
              key={screenshot.hash}
              screenshot={screenshot}
              onDelete={handleDelete}
              storyInput={storyData}
              imageDiffResult={state.imageDiffResults.find(
                (x) =>
                  x.storyId === storyData.id &&
                  x.screenshotHash === screenshot.hash,
              )}
            />
          ))}

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
