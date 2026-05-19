import type { ActionDialogDialogProps } from './ActionDialog';
import { Button, CircularProgress, TextField } from '@mui/material';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { makeStyles } from '@mui/styles';

import React, { useCallback, useEffect, useState } from 'react';
import { ActionDialog } from './ActionDialog';
import { toast } from '../../utils';

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
  extends
    StyleProps,
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
  const [hasError, setHasError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const classes = useStyles({ width });
  const showGenerateButton = Boolean(onGenerateContent);

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
      toast.error(requiredMessage);
      setHasError(true);
      return;
    }
    onSave(inputValue.trim());
  }, [inputValue, onSave, required, requiredMessage]);

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
        error={hasError}
        required
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />

      {showGenerateButton && (
        <div style={{ justifyContent: 'end', display: 'flex' }}>
          <Button
            className={classes.generateButton}
            size="small"
            onClick={handleGenerate}
            disabled={isGenerating}
            startIcon={isGenerating ? <CircularProgress size={14} /> : undefined}
          >
            {isGenerating ? 'Generating...' : 'Generate Title'}
          </Button>
        </div>
      )}
      {children}
    </ActionDialog>
  );
};

InputDialog.displayName = 'InputDialog';

export type InputModalProps = Omit<InputDialogProps, 'open' | 'onClose'>;

const InputDialogModal = NiceModal.create<InputModalProps>((props) => {
  const modal = useModal();

  const handleClose = useCallback(() => {
    modal.hide();
  }, [modal]);

  const handleSave = useCallback(
    (content: string) => {
      props.onSave(content);
      modal.hide();
    },
    [modal, props],
  );

  return (
    <InputDialog
      {...props}
      open={modal.visible}
      onClose={handleClose}
      onSave={handleSave}
    />
  );
});

InputDialogModal.displayName = 'InputDialogModal';

export const INPUT_DIALOG_MODAL_ID = 'input-dialog';

let registered = false;

const registerInputDialogModal = () => {
  if (registered) return;
  NiceModal.register(INPUT_DIALOG_MODAL_ID, InputDialogModal);
  registered = true;
};

const inputModal = {
  show: (props: InputModalProps) => NiceModal.show(INPUT_DIALOG_MODAL_ID, props),
};

export { InputDialog, inputModal, registerInputDialogModal };
