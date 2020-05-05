import React, { SFC, memo, useCallback, useState, useEffect } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { ControlProps } from '../../../typings';
import { useControl, useSelectorManager, SelectorType } from '../../../hooks';
import { FormControl } from './FormControl';
import TargetIcon from '@material-ui/icons/FilterCenterFocusSharp';
import { isValidSelector } from '../../../utils';
import clsx from 'clsx';
import PointerIcon from '@material-ui/icons/FilterTiltShift';
import { useActionDispatchContext } from '../../../store';

const useStyles = makeStyles(
  (theme) => {
    return {
      button: {
        color: theme.palette.text.primary,
      },
      buttonWrap: {
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 66,
        marginBottom: -35,
        zIndex: 1,
      },
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

export interface SelectorControlProps extends ControlProps {
  selectorType: SelectorType;
  isFollowedByPositionProp: boolean;
  fullObjectPath: string;
  actionId: string;
}

const SelectorControl: SFC<SelectorControlProps> = memo((props) => {
  const {
    selectorType,
    label,
    appendValueToTitle,
    onAppendValueToTitle,
    description,
    value,
    isFollowedByPositionProp,
    fullObjectPath,
    actionId,
  } = props;

  const [validate, setValidate] = useState(false);

  const classes = useStyles();

  const [invalidSelector, setInvalidSelector] = useState(false);

  const dispatch = useActionDispatchContext();

  const { startSelector } = useSelectorManager();

  const { Control, knob, handleChange, setKnob } = useControl(props);

  const handleSelectorClick = useCallback(() => {
    setValidate(false);
    startSelector({
      onData: (data) => {
        if (selectorType === 'selector') {
          dispatch({
            actionId,
            objPath: fullObjectPath,
            type: 'setActionOptions',
            val: data.path,
          });
        } else if (isFollowedByPositionProp) {
          const objPath = fullObjectPath.slice(0, -2);
          dispatch({
            actionId,
            objPath: `${objPath}.x`,
            type: 'setActionOptions',
            val: data.x,
          });
          dispatch({
            actionId,
            objPath: `${objPath}.y`,
            type: 'setActionOptions',
            val: data.y,
          });
        } else {
          handleChange(data[label]);
        }
      },
      type: selectorType,
    });
  }, [
    actionId,
    dispatch,
    fullObjectPath,
    handleChange,
    isFollowedByPositionProp,
    label,
    selectorType,
    startSelector,
  ]);

  useEffect(() => {
    if (validate && selectorType !== 'selector') {
      setInvalidSelector(false);
      return;
    }

    setInvalidSelector(!isValidSelector(value as string));
  }, [selectorType, validate, value]);

  useEffect(() => {
    if (knob.defaultValue !== value) {
      handleChange(value);
      setKnob({ ...knob, defaultValue: value, value });
    }
  }, [handleChange, knob, setKnob, value]);

  const handleControlChange = useCallback(
    (value: string) => {
      setValidate(true);
      handleChange(value);
    },
    [handleChange],
  );

  const handleClick = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) =>
      setValidate(e.target.tagName === 'TEXTAREA'),
    [],
  );

  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
    >
      <div
        className={clsx('selector-root', classes.root, {
          [classes.error]: invalidSelector && validate,
        })}
        onBlur={handleClick}
      >
        <Control onChange={handleControlChange} knob={knob} required />
        <div
          className={clsx({ [classes.buttonWrap]: isFollowedByPositionProp })}
        >
          <IconButton
            size="small"
            onClick={handleSelectorClick}
            className={classes.button}
          >
            {selectorType === 'selector' ? <TargetIcon /> : <PointerIcon />}
          </IconButton>
        </div>
      </div>
      {invalidSelector && validate && (
        <div className={clsx('selector-error', classes.errorMessage)}>
          Invalid Selector!
        </div>
      )}
    </FormControl>
  );
});

SelectorControl.displayName = 'SelectorControl';

export { SelectorControl };
