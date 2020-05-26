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
    clearResult,
    error,
    clearError,
    saving,
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
        required
      />
      {error && (
        <Snackbar
          message={error}
          open={error !== undefined}
          onClose={clearError}
          type="error"
        />
      )}

      {result && result.pass && (
        <Snackbar
          title="Identical Screenshot"
          open={true}
          onClose={clearResult}
          type="success"
        >
          <div>
            Title: {result.oldScreenShotTitle}
            <br />
            Screenshot with the same setting found, no change has been detected.
          </div>
        </Snackbar>
      )}

      {result && result.added && (
        <Snackbar
          message={'Screenshot saved successfully.'}
          open={true}
          onClose={clearResult}
          type="success"
          autoHideDuration={2000}
        />
      )}
      <Loader open={saving} />
      <ImageDiffMessage result={result} onClose={clearResult} />
    </>
  );
};

ScreenshotSaveDialog.displayName = 'ScreenshotSaveDialog';

export { ScreenshotSaveDialog };
