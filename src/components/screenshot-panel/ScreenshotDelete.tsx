/* eslint-disable react-hooks/exhaustive-deps */
import React, { SFC, useCallback, useEffect } from 'react';
import { ScreenshotData } from '../../typings';
import { useDeleteScreenshot } from '../../hooks';
import { DeleteConfirmationButton } from '../common';

export interface ScreenshotDeleteProps {
  screenshot: ScreenshotData;
  onClose: () => void;
  onStateChange: (working: boolean) => void;
}

const ScreenshotDelete: SFC<ScreenshotDeleteProps> = (props) => {
  const { onStateChange, screenshot, onClose } = props;

  const {
    deleteScreenshot,
    inProgress: deleteLoading,
    ErrorSnackbar,
  } = useDeleteScreenshot();

  const handleDeleteConfirmation = useCallback(() => {
    deleteScreenshot(screenshot.hash);
  }, [deleteScreenshot, screenshot.hash]);

  useEffect(() => {
    onStateChange(deleteLoading);
  }, [deleteLoading]);

  return (
    <>
      <DeleteConfirmationButton
        onClose={onClose}
        onDelete={handleDeleteConfirmation}
      />
      <ErrorSnackbar />
    </>
  );
};

ScreenshotDelete.displayName = 'ScreenshotDelete';

export { ScreenshotDelete };
