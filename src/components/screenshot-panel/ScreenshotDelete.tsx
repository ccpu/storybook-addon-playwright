import React, { SFC, useCallback } from 'react';
import { ScreenshotData } from '../../typings';
import { useDeleteScreenshot } from '../../hooks';
import { Loader, DeleteConfirmationButton } from '../common';

export interface ScreenshotDeleteProps {
  screenshot: ScreenshotData;
}

const ScreenshotDelete: SFC<ScreenshotDeleteProps> = (props) => {
  const { screenshot } = props;

  const {
    deleteScreenshot,
    inProgress: deleteLoading,
    ErrorSnackbar,
  } = useDeleteScreenshot();

  const handleDeleteConfirmation = useCallback(() => {
    deleteScreenshot(screenshot.hash);
  }, [deleteScreenshot, screenshot.hash]);

  return (
    <>
      <Loader open={deleteLoading} />
      <DeleteConfirmationButton onDelete={handleDeleteConfirmation} />
      <ErrorSnackbar />
    </>
  );
};

ScreenshotDelete.displayName = 'ScreenshotDelete';

export { ScreenshotDelete };
