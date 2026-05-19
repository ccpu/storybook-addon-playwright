import { Button, DialogActions, TextField } from '@mui/material';
import React from 'react';
import { useFixScreenshotFileName } from '../../hooks';
import { Dialog, Loader } from '../common';

interface Props {
  fixFunction?: boolean;
  onClose: (open: boolean) => void;
  open: boolean;
}

const FixScreenshotFileDialog: React.FC<Props> = ({ fixFunction, onClose, open }) => {
  const {
    fixFileNames,
    clearError,
    fixFileNamesError,
    fixFileNamesInProgress,
    handleReload,
    reload,
    functionName,
    handleFunctionNameInput,
  } = useFixScreenshotFileName({ fixFunction });

  const handleClose = React.useCallback(() => {
    clearError();
    onClose(false);
  }, [onClose, clearError]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        title="Fix Screenshot File Name"
        width="400px"
      >
        <Loader open={fixFileNamesInProgress} />

        <div style={{ padding: 20, width: '100%' }}>
          {reload && !fixFileNamesError ? (
            <p>Fix applied, reload the page</p>
          ) : (
            <>
              <p>
                Screenshot file name consist of the story title and story function name,
                when the title or function name changes, plugin is no longer able to
                detect the screenshots, hence it wont list the screenshots in the panel.
              </p>
              <p>
                This utility will apply changes to the screenshot file name and playwright
                config file.
              </p>
            </>
          )}
          {fixFunction && (
            <TextField
              label="Enter previous name export function"
              variant="outlined"
              onChange={handleFunctionNameInput}
              value={functionName}
              fullWidth={true}
              focused={true}
              required={true}
            />
          )}

          {fixFileNamesError && <p style={{ color: 'red' }}>{fixFileNamesError}</p>}
        </div>
        <DialogActions>
          <>
            {reload ? (
              <Button onClick={handleReload} color="primary">
                Reload Page
              </Button>
            ) : (
              <>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={fixFileNames} color="primary" autoFocus>
                  Apply Fix
                </Button>
              </>
            )}
          </>
        </DialogActions>
      </Dialog>
    </>
  );
};

FixScreenshotFileDialog.displayName = 'FixScreenshotFileDialog';

const MemoizedFixScreenshotFileDialog = React.memo(FixScreenshotFileDialog);
export { FixScreenshotFileDialog, MemoizedFixScreenshotFileDialog };
