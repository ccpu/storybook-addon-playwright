import { Action } from '../store/reducer';
import {
  useGlobalDispatch,
  DispatchType,
} from '../../../hooks/use-global-dispatch';

export const useGlobalActionDispatch = (callback?: DispatchType<Action>) => {
  const { dispatch } = useGlobalDispatch<Action>('action-dispatch', callback);

  return { dispatch };
};
