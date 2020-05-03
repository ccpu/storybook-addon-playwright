import React, { SFC, memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { capitalize } from '../../../utils';
import HelpOutlineSharp from '@material-ui/icons/HelpOutlineSharp';
import { Tooltip } from '@material-ui/core';
import CheckSelected from '@material-ui/icons/CheckCircleOutlineRounded';
import CheckNotSelected from '@material-ui/icons/RadioButtonUncheckedRounded';

const useStyles = makeStyles(
  () => {
    return {
      controlWrap: {
        flex: 2,
      },
      iconWrapper: {
        marginBottom: -2,
        marginRight: -8,
        paddingLeft: 4,
        width: 14,
      },
      icons: {
        '&:hover': {
          opacity: 0.8,
        },
        cursor: 'pointer',
        fontSize: 14,
        opacity: 0.4,
      },
      labelWrap: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
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
  { name: 'FormControl' },
);

export interface ControlFormProps {
  label: string;
  description?: string;
  appendValueToTitle: boolean;
  onAppendValueToTitle: () => void;
}

const FormControl: SFC<ControlFormProps> = memo((props) => {
  const {
    label,
    description,
    appendValueToTitle,
    onAppendValueToTitle,
    children,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.labelWrap}>
        <span>{capitalize(label)}</span>
      </div>
      <div className={classes.controlWrap}>{children}</div>
      <div className={classes.iconWrapper}>
        <div>
          {description && (
            <Tooltip
              placement="top"
              interactive
              enterDelay={800}
              title={description}
            >
              <HelpOutlineSharp className={classes.icons} />
            </Tooltip>
          )}
        </div>
        <div onClick={onAppendValueToTitle}>
          <Tooltip
            placement="top"
            enterDelay={800}
            title="Append value to title"
          >
            {appendValueToTitle ? (
              <CheckSelected style={{ opacity: 1 }} className={classes.icons} />
            ) : (
              <CheckNotSelected className={classes.icons} />
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
});

FormControl.displayName = 'FormControl';

export { FormControl };
