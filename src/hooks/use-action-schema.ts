import { useContext } from 'react';
import { ActionContext } from '../store';
import { ActionSchema } from '../typings';

export const useActionSchema = (key: string): ActionSchema | undefined => {
  const { actionSchema } = useContext(ActionContext);

  return actionSchema ? actionSchema[key] : undefined;
};
