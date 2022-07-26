export const useAnchorEl = jest.fn();

useAnchorEl.mockImplementation(() => ({
  anchorEl: document.createElement('div'),
  anchorElRef: {},
  clearAnchorEl: jest.fn(),
  setAnchorEl: jest.fn(),
}));
