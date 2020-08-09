import { Action } from '../store/actions/reducer';
import { useGlobalDispatch, DispatchType } from './use-global-dispatch';

export const useGlobalActionDispatch = (callback?: DispatchType<Action>) => {
  const { dispatch } = useGlobalDispatch<Action>('action-dispatch', callback);

  return { dispatch };
};
