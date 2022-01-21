/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { ScreenshotData } from '../../typings';
import { useDeleteScreenshot } from '../../hooks';
import { DeleteConfirmationButton } from '../common';

export interface ScreenshotDeleteProps {
  screenshot: ScreenshotData;
  onClose: () => void;
  onStateChange: (working: boolean) => void;
  onDelete: () => void;
}

const ScreenshotDelete: React.FC<ScreenshotDeleteProps> = (props) => {
  const { onStateChange, screenshot, onClose, onDelete } = props;

  const {
    deleteScreenshot,
    inProgress: deleteLoading,
    ErrorSnackbar,
  } = useDeleteScreenshot();

  const handleDeleteConfirmation = useCallback(() => {
    deleteScreenshot(screenshot.id);
    onDelete();
  }, [deleteScreenshot, screenshot.id]);

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
