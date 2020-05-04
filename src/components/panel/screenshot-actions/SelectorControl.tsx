import React, { SFC, memo, useCallback, useEffect, useState } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { ControlProps } from '../../../typings';
import { useControl, useSelectorState } from '../../../hooks';
import { FormControl } from './FormControl';
import TargetIcon from '@material-ui/icons/FilterCenterFocusSharp';
import { findSelector } from '../../../utils';
import clsx from 'clsx';

const useStyles = makeStyles(
  () => {
    return {
      error: {
        '& textarea': {
          border: '1px solid red',
        },
      },
      errorMessage: {
        color: 'red',
      },
      root: {
        alignItems: 'center',
        display: 'flex',
      },
    };
  },
  { name: 'SelectorControl' },
);

const SelectorControl: SFC<ControlProps> = memo((props) => {
  const {
    label,
    appendValueToTitle,
    onAppendValueToTitle,
    description,
  } = props;

  const classes = useStyles();

  const [invalidSelector, setInvalidSelector] = useState(false);

  const { selectorState, setSelectorState } = useSelectorState();

  const { Control, knob, handleChange } = useControl(props);

  const handleSelectorClick = useCallback(() => {
    setSelectorState({ ...selectorState, start: true, type: 'selector' });
  }, [selectorState, setSelectorState]);

  useEffect(() => {
    if (!selectorState || !selectorState.path) return;
    handleChange(selectorState.path);
    setSelectorState({ ...selectorState, path: undefined, start: false });
  }, [handleChange, selectorState, setSelectorState]);

  const validateSelector = useCallback((selector: string) => {
    if (!selector || findSelector(selector) === null) {
      setInvalidSelector(true);
    } else {
      setInvalidSelector(false);
    }
  }, []);

  const handleControlChange = useCallback(
    (value: string) => {
      validateSelector(value);
      handleChange(value);
    },
    [handleChange, validateSelector],
  );

  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
    >
      <div className={clsx(classes.root, { [classes.error]: invalidSelector })}>
        <Control onChange={handleControlChange} knob={knob} required />
        <IconButton size="small" onClick={handleSelectorClick}>
          <TargetIcon />
        </IconButton>
      </div>
      {invalidSelector && (
        <div className={classes.errorMessage}>Invalid Selector!</div>
      )}
    </FormControl>
  );
});

SelectorControl.displayName = 'SelectorControl';

export { SelectorControl };
