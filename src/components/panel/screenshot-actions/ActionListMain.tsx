import React, { SFC, memo, useCallback, useContext } from 'react';
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
      const newAction: StoryAction = {
        id: nanoid(10),
        schemaKey: actionKey,
        storyId: storybookState.storyId,
      };
      dispatch({ action: newAction, type: 'addStoryAction' });
    },
    [dispatch, storybookState.storyId],
  );

  return (
    <>
      <ActionToolbar onAddAction={handleAddAction} />
      <ActionList storyId={storybookState.storyId} />
    </>
  );
});

ActionListMain.displayName = 'ActionListMain';

export { ActionListMain };
