import { useState, useCallback } from 'react';
import { ControlTypes, ControlProps } from '../typings';
import { KnobStoreKnob } from '@storybook/addon-knobs/dist/KnobStore';
import {
  getKnobControl,
  KnobControlType,
} from '@storybook/addon-knobs/dist/components/types';

const convertOptions = (options?: string[]): {} => {
  return options.reduce((obj, key) => {
    obj[key] = key;
    return obj;
  }, {});
};

const getDefault = (type: ControlTypes, defVal: unknown): unknown => {
  if (defVal) return defVal;
  switch (type) {
    case 'boolean':
      return false;
    case 'number':
      return 0;
    case 'options':
      return [];
    default:
      return '';
  }
};

export const useControl = (
  props: ControlProps,
): {
  Control: KnobControlType;
  makeChangeHandler: (value: unknown) => void;
  knob: Partial<KnobStoreKnob>;
} => {
  const { label, type, onChange, value, options, display } = props;
  const [knob, setKnob] = useState<Partial<KnobStoreKnob>>({
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

  const Control = getKnobControl(type);

  const makeChangeHandler = useCallback(
    (value): void => {
      setKnob({ ...knob, value });
      onChange(value);
    },
    [knob, onChange],
  );

  return { Control, knob, makeChangeHandler };
};
