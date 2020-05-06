import React, { SFC, memo, useCallback, useEffect } from 'react';
import { useStorybookState } from '@storybook/api';
import { ActionList } from './ActionList';
import { StoryAction } from '../../../typings';
import { useActionDispatchContext } from '../../../store/actions';
import { ActionToolbar } from './ActionToolbar';
import { nanoid } from 'nanoid';

interface Props {
  onClose: () => void;
}

const ActionListSet: SFC<Props> = memo(({ onClose }) => {
  const dispatch = useActionDispatchContext();

  const storybookState = useStorybookState();

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
  }, [dispatch, storybookState.storyId]);

  const handleSave = useCallback(() => {
    console.log('save');
  }, []);

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

ActionListSet.displayName = 'ActionListSet';

export { ActionListSet };
