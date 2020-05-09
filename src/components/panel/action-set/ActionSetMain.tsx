import React, { SFC, memo, useState, useCallback, useEffect } from 'react';
import { ActionSetEditor } from './ActionSetEditor';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { nanoid } from 'nanoid';
import { useStorybookState } from '@storybook/api';
import { ActionSetList } from './ActionSetList';
// import { useTimeoutFn } from 'react-use';

const ActionSetMain: SFC = memo(() => {
  const [showActionList, setShowActionList] = useState(false);

  const [showDescDialog, setShowDescDialog] = useState(false);

  const [editActionSetId, setEditActionSetId] = useState<string>();

  const { storyId } = useStorybookState();

  const [actionSetStoryId, setActionSetStoryId] = useState<string>(storyId);

  const dispatch = useActionDispatchContext();

  const toggleActionListSet = useCallback(() => {
    setShowActionList(!showActionList);
  }, [showActionList]);

  const toggleDescriptionDialog = useCallback(() => {
    setShowDescDialog(!showDescDialog);
  }, [showDescDialog]);

  const createNewActionSet = useCallback(
    (desc) => {
      const id = nanoid(12);
      dispatch({
        actionSetId: id,
        description: desc,
        storyId,
        type: 'addActionSet',
      });
      toggleDescriptionDialog();
      toggleActionListSet();
      setEditActionSetId(id);
    },
    [dispatch, storyId, toggleActionListSet, toggleDescriptionDialog],
  );

  const removeActionSet = useCallback(() => {
    dispatch({
      actionSetId: editActionSetId,
      type: 'removeActionSet',
    });
    toggleActionListSet();
  }, [editActionSetId, dispatch, toggleActionListSet]);

  // useTimeoutFn(() => {
  //   createNewActionSet('new action');
  // }, 1000);

  useEffect(() => {
    if (storyId === actionSetStoryId) return;
    removeActionSet();
    setActionSetStoryId(storyId);
  }, [actionSetStoryId, removeActionSet, storyId]);

  return (
    <div style={{ height: 'calc(100% - 55px)', transform: 'none' }}>
      {editActionSetId ? (
        <>
          <ActionSetEditor
            onClose={removeActionSet}
            actionSetId={editActionSetId}
          />
        </>
      ) : (
        <>
          <ActionToolbar onAddActionSet={toggleDescriptionDialog} />
          <ActionSetList />
        </>
      )}
      <InputDialog
        onClose={toggleDescriptionDialog}
        title="Action set title"
        open={showDescDialog}
        onSave={createNewActionSet}
        required
      />
    </div>
  );
});

ActionSetMain.displayName = 'ActionSetMain';

export { ActionSetMain };
