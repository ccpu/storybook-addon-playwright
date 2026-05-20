import type { SelectorType } from '../../../hooks';
import type { ControlProps } from '../../../typings';
import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TargetIcon from '@mui/icons-material/FilterCenterFocusSharp';
import PointerIcon from '@mui/icons-material/FilterTiltShift';
import clsx from 'clsx';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useControl, useSelectorManager } from '../../../hooks';
import { isValidSelector } from '../../../utils';
import { resolveMuiIcon } from '../../../utils/resolve-mui-icon';
import { FormControl } from './FormControl';

const DEFAULT_SELECTOR_ATTRIBUTE_NAMES = ['id'];

const TargetIconComponent = resolveMuiIcon(TargetIcon);
const PointerIconComponent = resolveMuiIcon(PointerIcon);

const useStyles = makeStyles(
  (theme) => {
    return {
      button: {
        color: theme.palette.text.primary,
        '& svg': {
          height: 20,
          width: 20,
        },
      },
      buttonWrap: {
        alignItems: 'center',
        // backgroundColor: theme.palette.background.paper,
        display: 'flex',
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
      selectorButtonWrap: {
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
      },
      selectorHashIcon: {
        '&:before': {
          backgroundColor: theme.palette.background.paper,
          content: '"#"',
          fontSize: '12px',
          left: '6px',
          position: 'absolute',
          top: '3px',
        },
        height: 20,
        position: 'relative',
      },
      selectorIcon: {
        fontSize: '1.25rem',
      },
    };
  },
  { name: 'SelectorControl' },
);

export interface SelectorControlProps extends ControlProps {
  selectorType: 'selector' | 'position';
  isFollowedByPositionProp: boolean;
  fullObjectPath: string;
  onSelectorChange: (objPath: string, val: unknown) => void;
}

const SelectorControl: React.FC<SelectorControlProps> = memo((props) => {
  const {
    selectorType,
    label,
    appendValueToTitle,
    onAppendValueToTitle,
    description,
    value,
    isFollowedByPositionProp,
    fullObjectPath,
    isRequired,
    onSelectorChange,
  } = props;

  const [validate, setValidate] = useState(false);

  const classes = useStyles();

  const [invalidSelector, setInvalidSelector] = useState(false);

  const { startSelector } = useSelectorManager();

  const { data: clientConfig } = trpcClient.schema.getClientConfig.useQuery();

  const { Control, knob, handleChange, setKnob } = useControl(props);

  const startSelectorClick = useCallback(
    (type: SelectorType) => {
      setValidate(false);
      startSelector({
        onData: (data) => {
          if (type === 'selector' || type === 'id-selector') {
            onSelectorChange(fullObjectPath, data.path);
          } else if (isFollowedByPositionProp) {
            const objPath =
              fullObjectPath.length === 1 ? '' : `${fullObjectPath.slice(0, -2)}.`;
            onSelectorChange(`${objPath}x`, Math.round(data.x ?? 0));
            onSelectorChange(`${objPath}y`, Math.round(data.y ?? 0));
          } else {
            const key = label === 'top' ? 'y' : label === 'left' ? 'x' : label;
            handleChange(data[key]);
          }
        },
        selectorAttributeNames:
          clientConfig?.selectorAttributeNames ?? DEFAULT_SELECTOR_ATTRIBUTE_NAMES,
        type,
      });
    },
    [
      startSelector,
      isFollowedByPositionProp,
      onSelectorChange,
      fullObjectPath,
      label,
      handleChange,
      clientConfig?.selectorAttributeNames,
    ],
  );

  const handleSelectorClick = React.useCallback(() => {
    startSelectorClick(selectorType);
  }, [selectorType, startSelectorClick]);

  const handleIdSelectorClick = React.useCallback(() => {
    startSelectorClick('id-selector');
  }, [startSelectorClick]);

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
    (value: unknown) => {
      setValidate(true);
      handleChange(value);
    },
    [handleChange],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => setValidate(e.target.tagName === 'TEXTAREA'),
    [],
  );

  const isSelector = selectorType === 'selector';

  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
      isRequired={isRequired}
    >
      <div
        className={clsx('selector-root', classes.root, {
          [classes.error]: invalidSelector && validate,
        })}
        onBlur={handleBlur}
      >
        <Control onChange={handleControlChange} knob={knob} />
        <div
          className={clsx({
            [classes.buttonWrap]: isFollowedByPositionProp,
            [classes.selectorButtonWrap]: isSelector,
          })}
        >
          <IconButton
            size="small"
            onClick={handleSelectorClick}
            className={classes.button}
          >
            {isSelector ? (
              <TargetIconComponent className={classes.selectorIcon} />
            ) : (
              <PointerIconComponent />
            )}
          </IconButton>

          {isSelector && (
            <IconButton
              size="small"
              onClick={handleIdSelectorClick}
              className={classes.button}
            >
              <div className={classes.selectorHashIcon}>
                <TargetIconComponent className={classes.selectorIcon} />
              </div>
            </IconButton>
          )}
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
