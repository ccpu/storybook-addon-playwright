/* eslint-disable react-hooks/exhaustive-deps */
import type { ScreenshotData } from '../../../../typings';
import React, { useCallback, useEffect } from 'react';
import { DeleteConfirmationButton } from '../../../../components/common';
import { useDeleteScreenshot } from '../../hooks/use-delete-screenshot';

export interface ScreenshotDeleteProps {
  screenshot: ScreenshotData;
  onClose: () => void;
  onStateChange: (working: boolean) => void;
  onDelete: () => void;
}

const ScreenshotDelete: React.FC<ScreenshotDeleteProps> = (props) => {
  const { onStateChange, screenshot, onClose, onDelete } = props;

  const { deleteScreenshot, inProgress: deleteLoading } = useDeleteScreenshot();

  const handleDeleteConfirmation = useCallback(() => {
    deleteScreenshot(screenshot.id);
    onDelete();
  }, [deleteScreenshot, screenshot.id]);

  useEffect(() => {
    onStateChange(deleteLoading);
  }, [deleteLoading]);

  return (
    <>
      <DeleteConfirmationButton onClose={onClose} onDelete={handleDeleteConfirmation} />
    </>
  );
};

ScreenshotDelete.displayName = 'ScreenshotDelete';

export { ScreenshotDelete };
