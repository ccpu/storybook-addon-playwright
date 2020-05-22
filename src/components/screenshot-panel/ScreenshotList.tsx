import React, { SFC, useCallback } from 'react';
import { useStoryScreenshotLoader, useDeleteScreenshot } from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, SnackbarWithRetry, ListWrapper, ListItem } from '../common';
import { ScreenshotData } from '../../typings';

const ScreenshotList: SFC = () => {
  const { loading, error, clearError, doRetry } = useStoryScreenshotLoader();

  const state = useScreenshotContext();

  const {
    deleteScreenshot,
    error: deleteError,
    loading: deleteLoading,
    clearError: deleteClearError,
  } = useDeleteScreenshot();

  const handleEdit = useCallback((screenshot: ScreenshotData) => {
    console.log(screenshot);
  }, []);

  const handleDelete = useCallback(
    (screenshot: ScreenshotData) => {
      deleteScreenshot(screenshot.hash);
    },
    [deleteScreenshot],
  );

  return (
    <ListWrapper>
      {state &&
        state.screenshots &&
        state.screenshots.map((screenshot, i) => (
          <ListItem<ScreenshotData>
            index={i}
            key={screenshot.hash}
            item={screenshot}
            title={screenshot.title}
            onEdit={handleEdit}
            onDelete={handleDelete}
            useDeleteConfirmation={true}
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
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
