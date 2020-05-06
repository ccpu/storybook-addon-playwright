import React, { SFC, memo, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { ActionListSet } from '../screenshot-actions/ActionListSet';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { nanoid } from 'nanoid';
import { useStorybookState } from '@storybook/api';

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

// interface ActionSetEditorProps {
//   actionSetId: string;
// }

const AddNewSet: SFC = memo(() => {
  const [showActionList, setShowActionList] = useState(false);

  const [showDescDialog, setShowDescDialog] = useState(false);

  const [actionSetId, setActionSetId] = useState<string>();

  const { storyId } = useStorybookState();

  const dispatch = useActionDispatchContext();

  const classes = useStyles();

  const toggleActionListSet = useCallback(() => {
    setShowActionList(!showActionList);
  }, [showActionList]);

  const toggleDescriptionDialog = useCallback(() => {
    setShowDescDialog(!showDescDialog);
  }, [showDescDialog]);

  const createNewActionSet = useCallback(
    (desc) => {
      const id = nanoid();
      dispatch({
        actionSetId: id,
        description: desc,
        storyId,
        type: 'addActionSet',
      });
      toggleDescriptionDialog();
      toggleActionListSet();
      setActionSetId(id);
    },
    [dispatch, storyId, toggleActionListSet, toggleDescriptionDialog],
  );

  return (
    <>
      <ActionToolbar onAddActionSet={toggleDescriptionDialog} />
      {actionSetId && (
        <div
          className={classes.actionListWrapper}
          style={{ display: showActionList ? 'block' : 'none' }}
        >
          <ActionListSet
            onClose={toggleActionListSet}
            actionSetId={actionSetId}
          />
        </div>
      )}

      <InputDialog
        onClose={toggleDescriptionDialog}
        title="Action set title"
        open={showDescDialog}
        onSave={createNewActionSet}
        required
      />
    </>
  );
});

AddNewSet.displayName = 'AddNewSet';

export { AddNewSet };
