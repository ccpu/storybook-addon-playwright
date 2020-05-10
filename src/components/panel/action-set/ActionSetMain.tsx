import React, { SFC, memo, useState, useCallback, useEffect } from 'react';
import { ActionSetEditor } from './ActionSetEditor';
import { ActionToolbar } from './ActionSetToolbar';
import { InputDialog } from '../../common';
import { useActionDispatchContext } from '../../../store';
import { nanoid } from 'nanoid';
import { useStorybookState } from '@storybook/api';
import { ActionSetList } from './ActionSetList';

const ActionSetMain: SFC = memo(() => {
  const [showDescDialog, setShowDescDialog] = useState(false);

  const [editActionSetId, setEditActionSetId] = useState<string>();

  const { storyId } = useStorybookState();

  const [actionSetStoryId, setActionSetStoryId] = useState<string>(storyId);

  const [isNewAction, setIsNewAction] = useState(false);

  const dispatch = useActionDispatchContext();

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

      setEditActionSetId(id);
    },
    [dispatch, storyId, toggleDescriptionDialog],
  );

  const cancelEditActionSet = useCallback(() => {
    if (isNewAction) {
      dispatch({
        actionSetId: editActionSetId,
        type: 'removeActionSet',
      });
    }
    setEditActionSetId(undefined);
  }, [isNewAction, dispatch, editActionSetId]);

  useEffect(() => {
    if (!actionSetStoryId) {
      dispatch({ type: 'clearEditorActionSetId' });
      setIsNewAction(false);
    }

    if (storyId === actionSetStoryId) return;
    cancelEditActionSet();
    setActionSetStoryId(storyId);
  }, [actionSetStoryId, dispatch, cancelEditActionSet, storyId]);

  const handleComplete = useCallback(() => {
    setEditActionSetId(undefined);
  }, []);

  const handleEditActionSet = useCallback(
    (id: string) => {
      dispatch({ actionSetId: id, type: 'setEditorActionSetId' });
      setEditActionSetId(id);
    },
    [dispatch],
  );

  return (
    <div style={{ height: 'calc(100% - 55px)', transform: 'none' }}>
      {editActionSetId ? (
        <>
          <ActionSetEditor
            onClose={cancelEditActionSet}
            actionSetId={editActionSetId}
            onComplete={handleComplete}
          />
        </>
      ) : (
        <>
          <ActionToolbar onAddActionSet={toggleDescriptionDialog} />
          <ActionSetList onEdit={handleEditActionSet} />
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
