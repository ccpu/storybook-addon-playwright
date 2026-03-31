import { Action } from '../store/index';
import {
  useGlobalDispatch,
  DispatchType,
} from '../../../hooks/use-global-dispatch';

export const useGlobalScreenshotDispatch = (
  callback?: DispatchType<Action>,
) => {
  const { dispatch } = useGlobalDispatch<Action>(
    'screenshot-dispatch',
    callback,
  );

  return { dispatch };
};
