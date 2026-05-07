import { setDragStart, useDragStartValue } from '../store';

export function useDragStart() {
  const dragStart = useDragStartValue();
  return { dragStart, setDragStart };
}
