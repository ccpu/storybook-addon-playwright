import React, { SFC, memo, useCallback, useContext } from 'react';

import { ActionList } from './ActionList';
import { StoryAction } from '../../../typings';
import { ActionDispatchContext } from '../../../store/actions';
import { ActionToolbar } from './ActionToolbar';
import { nanoid } from 'nanoid';

const ActionListMain: SFC = memo(() => {
  const dispatch = useContext(ActionDispatchContext);

  const handleAddAction = useCallback(
    (actionKey: string) => {
      const newAction: StoryAction = {
        id: nanoid(10),
        schemaKey: actionKey,
      };
      dispatch({ action: newAction, type: 'addStoryAction' });
      // setMenuAnchorEl(null);
    },
    [dispatch],
  );

  // const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
  //   setMenuAnchorEl(event.currentTarget);
  // };

  return (
    <>
      <ActionToolbar onAddAction={handleAddAction} />

      <ActionList />
    </>
  );
});

ActionListMain.displayName = 'ActionListMain';

export { ActionListMain };
