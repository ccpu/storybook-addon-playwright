import React, { SFC, useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { saveScreenshot } from '../../api/client/save-screenshot';
import { BrowserTypes } from '../../typings';

export interface SaveScreenShotProps {
  open: boolean;
  onClose: () => void;
  screenShot: string;
  browserType: BrowserTypes;
}

const SaveScreenShot: SFC<SaveScreenShotProps> = (props) => {
  const { open, onClose, screenShot, browserType } = props;
  const [description, setDescription] = useState('');

  const handleSave = useCallback(() => {
    saveScreenshot({
      base64: screenShot,
      browserType,
      description: description,
    });
  }, [browserType, description, screenShot]);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    },
    [],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Description</DialogTitle>
      <DialogContent>
        <TextField
          multiline={true}
          variant="outlined"
          rows={5}
          style={{ width: 500 }}
          value={description}
          onChange={handleDescriptionChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SaveScreenShot.displayName = 'SaveScreenShot';

export { SaveScreenShot };
