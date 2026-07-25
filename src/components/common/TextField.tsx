import { cx } from '@emotion/css';
import React from 'react';
import { useUniqueId } from '../../hooks/use-unique-id';
import { makeStyles } from '../../styles';

export interface TextFieldProps {
  label?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  helperText?: React.ReactNode;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  error?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  /** Accepted for MUI compatibility (has no visual effect here). */
  focused?: boolean;
  /** Accepted for MUI compatibility (only the `outlined` look is provided). */
  variant?: 'outlined' | 'standard' | 'filled';
  /** Accepted for MUI compatibility; ignored. */
  slotProps?: unknown;
  className?: string;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(
  (theme) => ({
    error: {
      '& $input': {
        borderColor: theme.palette.error.main,
      },
      '& $label': {
        color: theme.palette.error.main,
      },
    },
    fullWidth: {
      width: '100%',
    },
    helperText: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      marginTop: 3,
    },
    input: {
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      boxSizing: 'border-box',
      color: theme.palette.text.primary,
      font: 'inherit',
      padding: '8.5px 14px',
      width: '100%',
      '&:focus': {
        borderColor: theme.palette.primary.main,
        outline: 'none',
      },
    },
    label: {
      color: theme.palette.text.secondary,
      display: 'block',
      fontSize: '0.75rem',
      marginBottom: 4,
    },
    root: {
      display: 'inline-flex',
      flexDirection: 'column',
    },
  }),
  { name: 'TextField' },
);

/** Text input with an optional label and helper text, replacing `@mui/material`'s `TextField`. */
const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  placeholder,
  type = 'text',
  multiline,
  rows,
  fullWidth,
  error,
  required,
  autoFocus,
  className,
  style,
}) => {
  const classes = useStyles();
  const id = useUniqueId('text-field');
  const fieldRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Focus imperatively rather than via the `autoFocus` attribute (which the
  // linter disallows for accessibility reasons).
  React.useEffect(() => {
    if (autoFocus) {
      fieldRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <div
      className={cx(
        classes.root,
        error && classes.error,
        fullWidth && classes.fullWidth,
        className,
      )}
      style={style}
    >
      {label != null && (
        <label className={classes.label} htmlFor={id}>
          {label}
          {required ? ' *' : ''}
        </label>
      )}
      {multiline ? (
        <textarea
          ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          className={classes.input}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      ) : (
        <input
          ref={fieldRef as React.RefObject<HTMLInputElement>}
          id={id}
          className={classes.input}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
      {helperText != null && <span className={classes.helperText}>{helperText}</span>}
    </div>
  );
};

TextField.displayName = 'TextField';

export { TextField };
