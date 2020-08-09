import { Action } from '../store/screenshot';
import { useGlobalDispatch, DispatchType } from './use-global-dispatch';

export const useGlobalScreenshotDispatch = (
  callback?: DispatchType<Action>,
) => {
  const { dispatch } = useGlobalDispatch<Action>(
    'screenshot-dispatch',
    callback,
  );

  return { dispatch };
};
