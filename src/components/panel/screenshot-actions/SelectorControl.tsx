import React, {
  SFC,
  memo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { ControlProps } from '../../../typings';
import { useControl, useSelectorState, SelectorType } from '../../../hooks';
import { FormControl } from './FormControl';
import TargetIcon from '@material-ui/icons/FilterCenterFocusSharp';
import { isValidSelector } from '../../../utils';
import clsx from 'clsx';
import PointerIcon from '@material-ui/icons/FilterTiltShift';
import { ActionDispatchContext } from '../../../store';

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
      hidden: {
        pointerEvents: 'none',
        visibility: 'hidden',
      },
      root: {
        alignItems: 'center',
        display: 'flex',
      },
      xyButtonPosition: {
        marginBottom: -38,
      },
    };
  },
  { name: 'SelectorControl' },
);

interface SelectorControlProps extends ControlProps {
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

  const classes = useStyles();

  const [invalidSelector, setInvalidSelector] = useState(false);

  const dispatch = useContext(ActionDispatchContext);

  const { startSelector } = useSelectorState();

  const { Control, knob, handleChange, setKnob } = useControl({
    ...props,
    value: undefined,
  });

  const validateSelector = useCallback(
    (selector: string) => {
      if (selectorType !== 'selector') return;
      if (isValidSelector(selector)) {
        setInvalidSelector(false);
      } else {
        setInvalidSelector(true);
      }
    },
    [selectorType],
  );

  const handleSelectorClick = useCallback(() => {
    startSelector({
      onData: (data) => {
        setInvalidSelector(false);
        if (selectorType === 'selector') {
          validateSelector(data.path);
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
      onStop: () => {
        setInvalidSelector(false);
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
    validateSelector,
  ]);
  console.log(value);
  useEffect(() => {
    if (knob.defaultValue !== value) {
      handleChange(value);
      setKnob({ ...knob, defaultValue: value, value });
    }
  }, [handleChange, knob, setKnob, value]);

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
        <div
          className={clsx({ [classes.buttonWrap]: isFollowedByPositionProp })}
        >
          <IconButton
            size="small"
            onClick={handleSelectorClick}
            className={clsx(classes.button, {
              // [classes.hidden]:
              //   selectorType === 'position' && !isFollowedByPositionProp,
              // [classes.xyButtonPosition]:
              //   selectorType === 'position' && isFollowedByPositionProp,
            })}
          >
            {selectorType === 'selector' ? <TargetIcon /> : <PointerIcon />}
          </IconButton>
        </div>
      </div>
      {invalidSelector && (
        <div className={classes.errorMessage}>Invalid Selector!</div>
      )}
    </FormControl>
  );
});

SelectorControl.displayName = 'SelectorControl';

export { SelectorControl };
