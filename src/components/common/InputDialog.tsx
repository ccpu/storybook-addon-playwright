import { TextField, makeStyles } from '@material-ui/core';
import React, { SFC, memo, useCallback, useState } from 'react';
import { ActionDialog, ActionDialogDialogProps } from './ActionDialog';

interface StyleProps {
  width?: number | string;
}

const useStyles = makeStyles(
  () => {
    return {
      input: {
        width: '100%',
      },
      paper: {
        width: (p: StyleProps) => p.width,
      },
    };
  },
  { name: 'InputDialog' },
);
export { useStyles as useInputDialogStyles };

export interface InputDialogProps
  extends StyleProps,
    Omit<ActionDialogDialogProps, 'onNegativeAction' | 'onPositiveAction'> {
  onSave: (content: string) => void;
  onCancel?: () => void;
  onClose: () => void;
  value?: string;
}

const InputDialog: SFC<InputDialogProps> = memo(
  ({ value = '', onSave, onCancel, onClose, width = '30%', ...rest }) => {
    const [inputValue, setValue] = useState(value);

    const classes = useStyles({ width: width });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
      },
      [],
    );

    const handleClose = useCallback(() => {
      onClose();
      if (onCancel) {
        onCancel();
      }
    }, [onCancel, onClose]);

    const handleSave = useCallback(() => {
      onSave(inputValue);
    }, [inputValue, onSave]);

    return (
      <ActionDialog
        onPositiveAction={handleSave}
        onNegativeAction={handleClose}
        onClose={handleClose}
        {...rest}
      >
        <TextField
          className={classes.input}
          multiline
          rows={5}
          value={inputValue}
          onChange={handleChange}
          variant="outlined"
        ></TextField>
      </ActionDialog>
    );
  },
);

InputDialog.displayName = 'InputDialog';

export { InputDialog };
