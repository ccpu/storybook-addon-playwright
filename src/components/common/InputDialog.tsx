import type { ActionDialogDialogProps } from './ActionDialog';
import { Button, CircularProgress, makeStyles, Snackbar, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { useCallback, useEffect, useState } from 'react';
import { ActionDialog } from './ActionDialog';

interface StyleProps {
  width?: number | string;
}

const useStyles = makeStyles(
  () => {
    return {
      generateButton: {
        marginTop: 8,
      },
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
    Omit<ActionDialogDialogProps, 'onNegativeAction' | 'onPositiveAction' | 'onClose'> {
  onSave: (content: string) => void;
  onCancel?: () => void;
  onClose: (closed?: true) => void;
  value?: string;
  required?: boolean;
  requiredMessage?: string;
  label?: string;
  onGenerateContent?: () => Promise<string | undefined>;
}

const InputDialog: React.FC<InputDialogProps> = ({
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
  onGenerateContent,
  ...rest
}) => {
  const [inputValue, setValue] = useState(value);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const classes = useStyles({ width });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const handleClose = useCallback(() => {
    onClose(true);
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

  const handleGenerate = useCallback(async () => {
    if (!onGenerateContent) return;
    setIsGenerating(true);
    try {
      const generated = await onGenerateContent();
      if (generated !== undefined) {
        setValue(generated);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerateContent]);

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
        autoFocus
        label={label}
        error={openSnackbar}
        required
        InputLabelProps={{
          shrink: true,
        }}
      ></TextField>
      {onGenerateContent && (
        <Button
          className={classes.generateButton}
          size="small"
          onClick={handleGenerate}
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={14} /> : undefined}
        >
          {isGenerating ? 'Generating...' : 'Generate Title'}
        </Button>
      )}
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
