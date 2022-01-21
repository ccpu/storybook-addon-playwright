import React from 'react';
import { useFixScreenshotFileName } from '../../hooks';
import { Button, TextField, DialogActions } from '@mui/material';
import { Dialog } from '../common';
import { IconButton } from '@storybook/components';
import FixIcon from '@mui/icons-material/BuildSharp';
import { Loader } from '../common';

interface Props {
  fixFunction?: boolean;
}

const FixScreenshotFileDialog: React.FC<Props> = ({ fixFunction }) => {
  const {
    fixFileNames,
    showFixScreenshotFileDialog,
    fixFileNamesError,
    fixFileNamesInProgress,
    handleHideFixScreenshotFileDialog,
    handleShowFixScreenshotFileDialog,
    handleReload,
    reload,
    functionName,
    handleFunctionNameInput,
  } = useFixScreenshotFileName({ fixFunction });

  return (
    <>
      <IconButton onClick={handleShowFixScreenshotFileDialog}>
        <FixIcon style={fixFunction && { width: 14 }} />
      </IconButton>
      <Dialog
        open={showFixScreenshotFileDialog}
        onClose={handleHideFixScreenshotFileDialog}
        title={'Fix Screenshot File Name'}
        width="400px"
      >
        <Loader open={fixFileNamesInProgress} />

        <div style={{ padding: 20, width: '100%' }}>
          {reload && !fixFileNamesError ? (
            <p>Fix applied, reload the page</p>
          ) : (
            <>
              <p>
                Screenshot file name consist of the story title and story
                function name, when the title or function name changes, plugin
                is no longer able to detect the screenshots, hence it wont list
                the screenshots in the panel.
              </p>
              <p>
                This utility will apply changes to the screenshot file name and
                playwright config file.
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

          {fixFileNamesError && (
            <p style={{ color: 'red' }}>{fixFileNamesError}</p>
          )}
        </div>
        <DialogActions>
          <>
            {reload ? (
              <Button onClick={handleReload} color="primary">
                Reload Page
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleHideFixScreenshotFileDialog}
                  color="primary"
                >
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
