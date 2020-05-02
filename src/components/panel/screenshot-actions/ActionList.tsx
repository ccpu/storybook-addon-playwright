import React, { SFC, useContext } from 'react';
import { ActionContext } from '../../../store/actions';
import { ActionOptions } from './ActionOptions';

const ActionList: SFC = () => {
  const { state } = useContext(ActionContext);
  console.log('ActionList');
  return (
    <>
      {state.storyActions.map((action) => (
        <ActionOptions
          key={action.id}
          actionName={action.schemaKey}
          actionId={action.id}
        />
      ))}
    </>
  );
};

ActionList.displayName = 'ActionList';

export { ActionList };
