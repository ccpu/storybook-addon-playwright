import React, { SFC, useCallback } from 'react';
import { InputDialog, Snackbar, Loader, ImageDiffMessage } from '../common';
import { useSaveScreenshot, useBrowserDevice } from '../../hooks';
import { BrowserTypes } from '../../typings';

export interface ScreenshotSaveDialogProps {
  open: boolean;
  onClose: () => void;
  browserType: BrowserTypes;
  base64: string;
}

const ScreenshotSaveDialog: SFC<ScreenshotSaveDialogProps> = (props) => {
  const { open, onClose, browserType, base64 } = props;

  const {
    saveScreenShot,
    result,
    onSuccessClose,
    saving,
    getUpdatingScreenshot,
    ErrorSnackbar,
  } = useSaveScreenshot();

  const { browserDevice } = useBrowserDevice();

  const handleSave = useCallback(
    async (description) => {
      onClose();
      await saveScreenShot(
        browserType as BrowserTypes,
        description,
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
        value={getUpdatingScreenshot()}
        required
      />

      <ErrorSnackbar />

      {result && result.added && (
        <Snackbar
          message={'Screenshot saved successfully.'}
          open={true}
          onClose={onSuccessClose}
          type="success"
          autoHideDuration={2000}
        />
      )}
      <Loader open={saving} />
      <ImageDiffMessage result={result} onClose={onSuccessClose} />
    </>
  );
};

ScreenshotSaveDialog.displayName = 'ScreenshotSaveDialog';

export { ScreenshotSaveDialog };
