import { TextField, makeStyles, Snackbar } from '@material-ui/core';
import React, { SFC, useCallback, useState, useEffect } from 'react';
import { ActionDialog, ActionDialogDialogProps } from './ActionDialog';
import Alert from '@material-ui/lab/Alert';

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
  required?: boolean;
  requiredMessage?: string;
  label?: string;
}

const InputDialog: SFC<InputDialogProps> = ({
  value = '',
  onSave,
  requiredMessage = 'Field is required',
  required,
  onCancel,
  onClose,
  width = '30%',
  open,
  children,
  label,
  ...rest
}) => {
  const [inputValue, setValue] = useState(value);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
    if (required && !inputValue) {
      setOpenSnackbar(true);
      return;
    }
    onSave(inputValue.trim());
  }, [inputValue, onSave, required]);

  const handleSnackbarClose = useCallback(() => {
    setOpenSnackbar(false);
  }, []);

  useEffect(() => {
    setValue(value);
  }, [value, open]);

  return (
    <ActionDialog
      onPositiveAction={handleSave}
      onNegativeAction={handleClose}
      onClose={handleClose}
      open={open}
      {...rest}
    >
      <TextField
        className={classes.input}
        multiline
        rows={3}
        value={inputValue}
        onChange={handleChange}
        variant="outlined"
        label={label}
        error={openSnackbar}
        required
        InputLabelProps={{
          shrink: true,
        }}
      ></TextField>
      {children}
      <Snackbar
        autoHideDuration={6000}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert severity="error">{requiredMessage}</Alert>
      </Snackbar>
    </ActionDialog>
  );
};

InputDialog.displayName = 'InputDialog';

export { InputDialog };
