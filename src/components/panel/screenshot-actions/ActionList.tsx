import React, { SFC, useContext, useMemo } from 'react';
import { ActionContext } from '../../../store/actions';
import { ActionOptions } from './ActionOptions';

const ActionList: SFC = () => {
  const state = useContext(ActionContext);

  return useMemo(() => {
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
  }, [state.storyActions]);
};

ActionList.displayName = 'ActionList';

export { ActionList };
