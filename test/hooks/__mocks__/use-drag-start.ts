import { useDragStart as orgUseDragStart } from '../../../src/hooks/use-drag-start';

const useDragStart = vi.fn<typeof orgUseDragStart>();
useDragStart.mockImplementation(() => {
  return { dragStart: false, setDragStart: vi.fn() };
});

export { useDragStart };
