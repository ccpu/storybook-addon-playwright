import { useDragStart } from '../use-drag-start';
import { renderHook } from '@testing-library/react-hooks';

describe('useDragStart', () => {
  it('should to be defined', () => {
    const { result } = renderHook(() => useDragStart());
    expect(result.current.dragStart).toBe(false);
    expect(result.current.setDragStart).toBeDefined();
  });
});
