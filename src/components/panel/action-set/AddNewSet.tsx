import React, { SFC, memo, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { ActionListSet } from '../screenshot-actions/ActionListSet';
import { ActionToolbar } from './ActionSetToolbar';

const useStyles = makeStyles(
  (theme) => {
    return {
      actionListWrapper: {
        backgroundColor: theme.palette.background.default,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      },
      button: {
        marginTop: 20,
      },
      root: {},
    };
  },
  { name: 'AddNewSet' },
);

const AddNewSet: SFC = memo(() => {
  const [showActionList, setShowActionList] = useState(false);

  const classes = useStyles();

  const toggleActionListSet = useCallback(() => {
    setShowActionList(!showActionList);
  }, [showActionList]);

  return (
    <>
      <ActionToolbar onAddActionSet={toggleActionListSet} />
      <div
        className={classes.actionListWrapper}
        style={{ display: showActionList ? 'block' : 'none' }}
      >
        <ActionListSet onClose={toggleActionListSet} />
      </div>
    </>
  );
});

AddNewSet.displayName = 'AddNewSet';

export { AddNewSet };
