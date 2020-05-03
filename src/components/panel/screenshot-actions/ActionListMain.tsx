import React, { SFC, memo, useCallback, useContext, useEffect } from 'react';
import { useStorybookState } from '@storybook/api';
import { ActionList } from './ActionList';
import { StoryAction } from '../../../typings';
import { ActionDispatchContext } from '../../../store/actions';
import { ActionToolbar } from './ActionToolbar';
import { nanoid } from 'nanoid';

const ActionListMain: SFC = memo(() => {
  const dispatch = useContext(ActionDispatchContext);

  const storybookState = useStorybookState();

  const handleAddAction = useCallback(
    (actionKey: string) => {
      const actionId = nanoid(10);
      const newAction: StoryAction = {
        id: actionId,
        schemaKey: actionKey,
        storyId: storybookState.storyId,
      };
      dispatch({ action: newAction, type: 'addStoryAction' });
      dispatch({ actionId, type: 'toggleActionExpansion' });
    },
    [dispatch, storybookState.storyId],
  );

  useEffect(() => {
    dispatch({ type: 'clearActionExpansion' });
  }, [dispatch, storybookState.storyId]);

  return (
    <>
      <ActionToolbar onAddAction={handleAddAction} />
      <ActionList storyId={storybookState.storyId} />
    </>
  );
});

ActionListMain.displayName = 'ActionListMain';

export { ActionListMain };
