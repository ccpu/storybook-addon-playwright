import React, { SFC, memo, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { ActionListMain } from '../screenshot-actions/ActionListMain';

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

  const handleShowActionList = useCallback(() => {
    setShowActionList(!showActionList);
  }, [showActionList]);

  return (
    <>
      <Button
        onClick={handleShowActionList}
        className={classes.button}
        fullWidth
      >
        Add New Action Set
      </Button>
      <div
        className={classes.actionListWrapper}
        style={{ display: showActionList ? 'block' : 'none' }}
      ></div>
      <ActionListMain />
    </>
  );
});

AddNewSet.displayName = 'AddNewSet';

export { AddNewSet };
