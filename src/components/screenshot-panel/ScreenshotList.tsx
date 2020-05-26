import React, { SFC, useCallback } from 'react';
import { useStoryScreenshotLoader, useDeleteScreenshot } from '../../hooks';
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

  // const handleEdit = useCallback((screenshot: ScreenshotData) => {
  //   console.log(screenshot);
  // }, []);

  const handleDelete = useCallback(
    (screenshot: ScreenshotData) => {
      deleteScreenshot(screenshot.hash);
    },
    [deleteScreenshot],
  );

  const handleTestStoryScreenShots = useCallback(() => {
    // testScreenshot({
    // })
  }, []);

  return (
    <>
      <ScreenshotListToolbar
        title="Story Screenshots"
        onTestClick={handleTestStoryScreenShots}
      />
      <ListWrapper>
        {state &&
          state.screenshots &&
          state.screenshots.map((screenshot) => (
            <ScreenshotListItem
              key={screenshot.hash}
              screenshot={screenshot}
              title={screenshot.title}
              onDelete={handleDelete}
              storyInput={storyData}
            />
          ))}

        <Loader open={loading || deleteLoading} />
        {(error || deleteError) && (
          <SnackbarWithRetry
            type="error"
            open={true}
            onClose={deleteError ? deleteClearError : clearError}
            message={error || deleteError}
            onRetry={deleteError ? undefined : doRetry}
          />
        )}
      </ListWrapper>
    </>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
