import React, { SFC, memo, useCallback, useContext } from 'react';

import { ActionList } from './ActionList';

import { ActionContext } from '../../../store/actions';
import { ActionToolbar } from './ActionToolbar';

const ActionListMain: SFC = memo(() => {
  const { addStoryAction } = useContext(ActionContext);

  const handleAddAction = useCallback(
    (actionKey: string) => {
      addStoryAction(actionKey);
      // setMenuAnchorEl(null);
    },
    [addStoryAction],
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
