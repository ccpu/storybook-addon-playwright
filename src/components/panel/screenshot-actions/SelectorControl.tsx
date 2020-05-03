import React, { SFC, memo, useCallback } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { ControlProps } from '../../../typings';
import { useControl, useSelectorState } from '../../../hooks';
import { FormControl } from './FormControl';
import TargetIcon from '@material-ui/icons/FilterCenterFocusSharp';

const useStyles = makeStyles(
  () => {
    return {
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

  const { selectorState, setSelectorState } = useSelectorState();

  const { Control, knob, makeChangeHandler } = useControl(props);

  const handleSelectorClick = useCallback(() => {
    setSelectorState({ ...selectorState, showSelectorOverlay: true });
  }, [selectorState, setSelectorState]);

  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
    >
      <div className={classes.root}>
        <Control onChange={makeChangeHandler} knob={knob} required />
        <IconButton size="small" onClick={handleSelectorClick}>
          <TargetIcon />
        </IconButton>
      </div>
    </FormControl>
  );
});

SelectorControl.displayName = 'SelectorControl';

export { SelectorControl };
