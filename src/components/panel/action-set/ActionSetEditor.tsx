import React, { SFC, memo, useCallback, useEffect } from 'react';
import { useStorybookApi } from '@storybook/api';
import { ActionList } from '../screenshot-actions/ActionList';
import { StoryAction, StoryInput } from '../../../typings';
import {
  useActionDispatchContext,
  useActionContext,
} from '../../../store/actions';
import { ActionToolbar } from '../screenshot-actions/ActionToolbar';
import { nanoid } from 'nanoid';
import { saveActionSet } from '../../../api/client/save-action-set';

interface Props {
  onClose: () => void;
  actionSetId: string;
}

const ActionSetEditor: SFC<Props> = memo(({ onClose, actionSetId }) => {
  const dispatch = useActionDispatchContext();

  const state = useActionContext();

  const api = useStorybookApi();

  const handleAddAction = useCallback(
    (actionName: string) => {
      const actionId = nanoid(10);
      const newAction: StoryAction = {
        id: actionId,
        name: actionName,
      };

      dispatch({ action: newAction, type: 'addStoryAction' });
      dispatch({ actionId, type: 'toggleActionExpansion' });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({ type: 'clearActionExpansion' });
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    const data = api.getCurrentStoryData() as StoryInput;
    const actionSet = state.actionSets.find((x) => x.id === actionSetId);

    await saveActionSet({
      actionSet,
      fileName: data.parameters.fileName,
      storyId: data.id,
    });
  }, [actionSetId, api, state.actionSets]);

  return (
    <>
      <ActionToolbar
        onAddAction={handleAddAction}
        onClose={onClose}
        onSave={handleSave}
      />
      <ActionList />
    </>
  );
});

ActionSetEditor.displayName = 'ActionSetEditor';

export { ActionSetEditor };
