import type { ControlProps, ControlTypes } from '../../../typings';
import { Form } from '@storybook/components';
import React, { useCallback, useState } from 'react';

interface ControlKnob {
  defaultValue?: unknown;
  name: string;
  options?: string[] | Record<string, string>;
  optionsObj?: { display?: string };
  type: string;
  value: unknown;
}

function convertOptions(options?: string[]) {
  if (!options) return undefined;

  return options.reduce((obj, key) => {
    obj[key] = key;
    return obj;
  }, {} as Record<string, string>);
}

function getDefault(type: ControlTypes, defVal: unknown): unknown {
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
}

// Simple control component that replaces @storybook/addon-knobs controls
const SimpleControl: React.FC<{
  onChange: (val: unknown) => void;
  knob: ControlKnob;
}> = ({ onChange, knob }) => {
  const handleInputChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    const value =
      knob.type === 'boolean'
        ? e.currentTarget.checked
        : knob.type === 'number'
        ? Number(e.currentTarget.value)
        : e.currentTarget.value;
    onChange(value);
  };

  const handleSelectChange: React.FormEventHandler<HTMLSelectElement> = (e) => {
    onChange(e.currentTarget.value);
  };

  const handleTextareaChange: React.FormEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    const value =
      knob.type === 'number'
        ? Number(e.currentTarget.value)
        : e.currentTarget.value;
    onChange(value);
  };

  if (knob.type === 'boolean') {
    return React.createElement(Form.Input, {
      checked: Boolean(knob.value),
      onChange: handleInputChange,
      type: 'checkbox',
    });
  }

  if (knob.type === 'number') {
    return React.createElement(Form.Input, {
      onChange: handleInputChange,
      type: 'number',
      value: knob.value as number,
    });
  }

  if (knob.type === 'select' && Array.isArray(knob.options)) {
    return React.createElement(
      Form.Select,
      { onChange: handleSelectChange, value: knob.value as string },
      knob.options.map((opt) =>
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
      Form.Select,
      { onChange: handleSelectChange, value: knob.value as string },
      Object.entries(opts).map(([key, val]) =>
        React.createElement('option', { key, value: val }, key),
      ),
    );
  }

  // Default: text/textarea input
  return React.createElement(Form.Textarea, {
    onChange: handleTextareaChange,
    value: (knob.value as string) || '',
  });
};

// Factory that returns the control component for compatibility with previous API
function getControl(_type: string) {
  void _type;
  return SimpleControl;
}

export function useControl(props: ControlProps) {
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
}
