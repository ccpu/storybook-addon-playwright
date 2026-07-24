import { css } from '@emotion/css';
import clsx from 'clsx';
import React from 'react';
import { useUniqueId } from '../../hooks/use-unique-id';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export interface FormControlProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface RadioGroupProps {
  row?: boolean;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface RadioProps {
  size?: 'small' | 'medium';
  /** Injected by {@link FormControlLabel}. */
  value?: string;
  checked?: boolean;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

export interface FormControlLabelProps {
  value: string;
  control: React.ReactElement;
  label: React.ReactNode;
  className?: string;
}

const formControlClass = css({ display: 'inline-flex', flexDirection: 'column' });

/** Layout wrapper for form fields, replacing `@mui/material`'s `FormControl`. */
const FormControl: React.FC<FormControlProps> = ({ className, style, children }) => (
  <div className={clsx(formControlClass, className)} style={style}>
    {children}
  </div>
);

FormControl.displayName = 'FormControl';

/** Group of radio buttons, replacing `@mui/material`'s `RadioGroup`. */
const RadioGroup: React.FC<RadioGroupProps> = ({
  row,
  name,
  value,
  onChange,
  className,
  style,
  children,
}) => {
  const generatedName = useUniqueId('radio-group');
  const groupClass = css({
    display: 'flex',
    flexDirection: row ? 'row' : 'column',
    flexWrap: 'wrap',
  });

  return (
    <RadioGroupContext.Provider value={{ name: name ?? generatedName, value, onChange }}>
      <div role="radiogroup" className={clsx(groupClass, className)} style={style}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';

/** Single radio input, replacing `@mui/material`'s `Radio`. */
const Radio: React.FC<RadioProps> = ({
  size = 'medium',
  value,
  checked,
  name,
  onChange,
  className,
}) => {
  const dimension = size === 'small' ? 16 : 20;

  return (
    <input
      type="radio"
      className={className}
      value={value}
      checked={checked}
      name={name}
      onChange={onChange}
      style={{ cursor: 'pointer', height: dimension, margin: '0 8px', width: dimension }}
    />
  );
};

Radio.displayName = 'Radio';

const labelClass = css({
  alignItems: 'center',
  cursor: 'pointer',
  display: 'inline-flex',
  marginRight: 16,
});

/** Radio/label pairing, replacing `@mui/material`'s `FormControlLabel`. */
const FormControlLabel: React.FC<FormControlLabelProps> = ({
  value,
  control,
  label,
  className,
}) => {
  const context = React.useContext(RadioGroupContext);
  const checked = context ? context.value === value : undefined;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    context?.onChange?.(event, value);
  };

  const controlElement = React.cloneElement(control as React.ReactElement<RadioProps>, {
    checked,
    name: context?.name,
    onChange: handleChange,
    value,
  });

  return (
    <label className={clsx(labelClass, className)}>
      {controlElement}
      <span>{label}</span>
    </label>
  );
};

FormControlLabel.displayName = 'FormControlLabel';

export { FormControl, FormControlLabel, Radio, RadioGroup };
