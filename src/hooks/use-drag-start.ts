import { useGlobalState } from './use-global-state';

export const useDragStart = () => {
  const [dragStart, setDragStart] = useGlobalState('drag-start', false);
  return { dragStart, setDragStart };
};
