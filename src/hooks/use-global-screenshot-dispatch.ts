import { useGlobalState } from './use-global-state';
import { Action } from '../store/screenshot';

export const useGlobalScreenshotDispatch = () => {
  const [action, dispatch] = useGlobalState<Action>('screenshot-dispatch');

  return { action, dispatch };
};
