import { useGlobalState } from './use-global-state';
import { Action } from '../store/actions/reducer';

export const useGlobalActionDispatch = () => {
  const [action, dispatch] = useGlobalState<Action>('action-dispatch');

  return { action, dispatch };
};
