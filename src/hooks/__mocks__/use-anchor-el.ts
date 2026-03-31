export const useAnchorEl = vi.fn();

useAnchorEl.mockImplementation(() => ({
  anchorEl: document.createElement('div'),
  anchorElRef: {},
  clearAnchorEl: vi.fn(),
  setAnchorEl: vi.fn(),
}));
