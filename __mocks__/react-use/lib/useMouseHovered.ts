import type useMouseHoveredFn from 'react-use/lib/useMouseHovered';

const useMouseHovered = vi
  .fn<typeof useMouseHoveredFn>()
  .mockImplementation(() => ({
    docX: 10,
    docY: 10,
    elH: 10,
    elW: 10,
    elX: 10,
    elY: 10,
    posX: 10,
    posY: 10,
  }));

export default useMouseHovered;
