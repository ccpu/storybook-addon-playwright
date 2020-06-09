export const useSelectorManager = jest.fn().mockImplementation(() => ({
  selectorManager: {},
  setSelectorData: jest.fn(),
  startSelector: jest.fn(),
  stopSelector: jest.fn(),
}));
