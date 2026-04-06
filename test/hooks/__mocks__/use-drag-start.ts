const useDragStart = vi.fn();
useDragStart.mockImplementation(() => {
  return { dragStart: false, setDragStart: vi.fn() };
});

export { useDragStart };
