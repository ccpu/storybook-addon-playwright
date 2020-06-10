import React, { SFC, useCallback } from 'react';
import { Loader, ImageDiffMessage, InputDialog } from '../common';
import { useSaveScreenshot, useBrowserDevice } from '../../hooks';
import { BrowserTypes } from '../../typings';

export interface ScreenshotSaveProps {
  onClose: () => void;
  base64: string;
  open: boolean;
  browserType: BrowserTypes;
}

const ScreenshotSave: SFC<ScreenshotSaveProps> = ({
  onClose,
  base64,
  browserType,
  open,
}) => {
  const { browserDevice } = useBrowserDevice();

  const {
    saveScreenShot,
    onSuccessClose,
    inProgress,
    getUpdatingScreenshotTitle,
    ErrorSnackbar,
    result,
  } = useSaveScreenshot();

  const handleSave = useCallback(
    async (title: string) => {
      onClose();
      await saveScreenShot(
        browserType as BrowserTypes,
        title,
        base64,
        browserDevice[browserType],
      );
    },
    [base64, browserDevice, browserType, onClose, saveScreenShot],
  );

  return (
    <>
      <InputDialog
        open={open}
        onClose={onClose}
        onSave={handleSave}
        title="Title"
        value={getUpdatingScreenshotTitle()}
        required
      ></InputDialog>

      <Loader open={inProgress} />

      <ErrorSnackbar />
      <ImageDiffMessage result={result} onClose={onSuccessClose} />
    </>
  );
};

ScreenshotSave.displayName = 'ScreenshotSave';

export { ScreenshotSave };
