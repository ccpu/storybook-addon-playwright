import React, { SFC, useCallback } from 'react';
import { useStoryScreenshotLoader } from '../../hooks';
import { useScreenshotContext } from '../../store/screenshot';
import { Loader, Snackbar, ListWrapper, ListItem } from '../common';
import { ScreenshotData } from '../../typings';

const ScreenshotList: SFC = () => {
  const { loading, error, clearError } = useStoryScreenshotLoader();

  const state = useScreenshotContext();

  const handleEdit = useCallback((screenshot: ScreenshotData) => {
    console.log(screenshot);
  }, []);

  const handleDelete = useCallback((screenshot: ScreenshotData) => {
    console.log(screenshot);
  }, []);

  return (
    <ListWrapper>
      {state &&
        state.screenshots.map((screenshot, index) => (
          <ListItem<ScreenshotData>
            key={screenshot.hash}
            index={index}
            item={screenshot}
            description={screenshot.description}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

      <Loader open={loading} />
      {error && (
        <Snackbar
          type="error"
          open={true}
          onClose={clearError}
          message={error}
        />
      )}
    </ListWrapper>
  );
};

ScreenshotList.displayName = 'ScreenshotList';

export { ScreenshotList };
