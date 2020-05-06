import React, { SFC, useMemo } from 'react';
import { ActionOptions } from './ActionOptions';
import { useActionSetActions } from '../../../hooks';

const ActionList: SFC = () => {
  const { actionSetActions } = useActionSetActions();

  return useMemo(() => {
    return (
      <>
        {actionSetActions.map((action) => (
          <ActionOptions
            key={action.id}
            actionName={action.name}
            actionId={action.id}
          />
        ))}
      </>
    );
  }, [actionSetActions]);
};

ActionList.displayName = 'ActionList';

export { ActionList };
