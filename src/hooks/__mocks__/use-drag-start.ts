const useDragStart = jest.fn();
useDragStart.mockImplementation(() => {
  return { dragStart: false, setDragStart: jest.fn() };
});

export { useDragStart };
