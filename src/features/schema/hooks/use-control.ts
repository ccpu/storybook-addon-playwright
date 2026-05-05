import React from 'react';
import { useState, useCallback } from 'react';
import { ControlTypes, ControlProps } from '../../../typings';

interface ControlKnob {
  defaultValue?: unknown;
  name: string;
  options?: string[] | Record<string, string>;
  optionsObj?: { display?: string };
  type: string;
  value: unknown;
}

const convertOptions = (options?: string[]) => {
  if (!options) return undefined;

  return options.reduce((obj, key) => {
    obj[key] = key;
    return obj;
  }, {} as Record<string, string>);
};

const getDefault = (type: ControlTypes, defVal: unknown): unknown => {
  if (defVal !== undefined) return defVal;
  switch (type) {
    case 'boolean':
      return false;
    case 'number':
      return '';
    case 'options':
      return [];
    default:
      return '';
  }
};

// Simple control component that replaces @storybook/addon-knobs controls
const SimpleControl: React.FC<{
  onChange: (val: unknown) => void;
  knob: ControlKnob;
}> = ({ onChange, knob }) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const value =
      knob.type === 'boolean'
        ? (e.target as HTMLInputElement).checked
        : knob.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    onChange(value);
  };

  if (knob.type === 'boolean') {
    return React.createElement('input', {
      checked: Boolean(knob.value),
      onChange: handleChange,
      type: 'checkbox',
    });
  }

  if (knob.type === 'number') {
    return React.createElement('input', {
      onChange: handleChange,
      type: 'number',
      value: knob.value as number,
    });
  }

  if (knob.type === 'select' && Array.isArray(knob.options)) {
    return React.createElement(
      'select',
      { onChange: handleChange, value: knob.value as string },
      (knob.options as string[]).map((opt) =>
        React.createElement('option', { key: opt, value: opt }, opt),
      ),
    );
  }

  if (
    knob.type === 'options' &&
    knob.options &&
    typeof knob.options === 'object'
  ) {
    const opts = knob.options as Record<string, string>;
    return React.createElement(
      'select',
      { onChange: handleChange, value: knob.value as string },
      Object.entries(opts).map(([key, val]) =>
        React.createElement('option', { key, value: val }, key),
      ),
    );
  }

  // Default: text/textarea input
  return React.createElement('textarea', {
    onChange: handleChange,
    value: (knob.value as string) || '',
  });
};

// Factory that returns the control component for compatibility with previous API
const getControl = (_type: string) => SimpleControl;

export const useControl = (props: ControlProps) => {
  const { label, type, onChange, value, options, display } = props;

  const [knob, setKnob] = useState<ControlKnob>({
    defaultValue: value,
    name: label,
    options:
      type === 'select'
        ? options
        : options
        ? convertOptions(options)
        : undefined,
    optionsObj: { display },
    type,
    value: getDefault(type, value),
  });

  const Control = getControl(type);

  const handleChange = useCallback(
    (value): void => {
      setKnob({ ...knob, value });
      onChange(value);
    },
    [knob, onChange],
  );

  return { Control, handleChange, knob, setKnob };
};
