const useMouseHovered = jest
  .fn()
  .mockImplementation(() => ({ elX: 10, elY: 10 }));

export default useMouseHovered;
