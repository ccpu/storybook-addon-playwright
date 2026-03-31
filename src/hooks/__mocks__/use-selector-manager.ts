export const useSelectorManager = vi.fn().mockImplementation(() => ({
  selectorManager: {},
  setSelectorData: vi.fn(),
  startSelector: vi.fn(),
  stopSelector: vi.fn(),
}));
