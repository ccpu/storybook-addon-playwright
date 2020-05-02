import React, { SFC, useState, memo, useMemo, useCallback } from 'react';
import { ControlTypes } from '../../../typings';
import { KnobStoreKnob } from '@storybook/addon-knobs/dist/KnobStore';
import { getKnobControl } from '@storybook/addon-knobs/dist/components/types';
import { OptionsKnobOptionsDisplay } from '@storybook/addon-knobs/dist/components/types/Options';
import { makeStyles } from '@material-ui/core';
import { capitalize } from '../../../utils';

const useStyles = makeStyles(
  () => {
    return {
      controlWrap: {
        flex: 2,
      },
      labelWrap: {
        flex: 1,
      },
      root: {
        '& fieldset > div': {
          '&>div': {
            margin: 0,
            marginRight: 10,
          },
          justifyContent: 'space-between',
        },
        '& input[type="number"], select,textarea': {
          width: '100%',
        },
        '& label': {
          border: 'none !important',
          margin: '0 !important',
        },
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4,
      },
    };
  },
  { name: 'ControlForm' },
);

export interface ControlFormProps {
  label: string;
  type: ControlTypes;
  value?: unknown;
  onChange: (value: unknown) => void;
  options?: string[];
  display?: OptionsKnobOptionsDisplay;
}

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

const ControlForm: SFC<ControlFormProps> = memo((props) => {
  const { label, type, onChange, value, options, display } = props;

  const [knob, setKnob] = useState<Partial<KnobStoreKnob>>({
    name: label,
    options:
      type === 'select'
        ? options
        : options
        ? options.reduce((obj, key) => {
            obj[key] = key;
            return obj;
          }, {})
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

  const classes = useStyles();
  return useMemo(() => {
    return (
      <div className={classes.root}>
        <div className={classes.labelWrap}>
          <span>{capitalize(label)}</span>
        </div>
        <div className={classes.controlWrap}>
          <Control onChange={makeChangeHandler} knob={knob} required />
        </div>
      </div>
    );
  }, [
    classes.controlWrap,
    classes.labelWrap,
    classes.root,
    knob,
    label,
    makeChangeHandler,
  ]);
});

ControlForm.displayName = 'ControlForm';

export { ControlForm };
