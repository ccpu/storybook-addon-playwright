import { useDragStartValue, setDragStart } from '../store';

export const useDragStart = () => {
  const dragStart = useDragStartValue();
  return { dragStart, setDragStart };
};
