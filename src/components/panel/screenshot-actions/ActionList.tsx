import React, { SFC, useCallback, useContext } from 'react';
import { ActionContext } from '../../../store/actions';
import { ActionOptions } from './ActionOptions';

const ActionList: SFC = () => {
  const { storyActions } = useContext(ActionContext);

  const handleChange = useCallback(() => {
    console.log('');
  }, []);

  return (
    <>
      {storyActions.map((action, i) => (
        <ActionOptions key={i} action={action} onChange={handleChange} />
      ))}
    </>
  );
};

ActionList.displayName = 'ActionList';

export { ActionList };
