import { useSelectorManager as orgUseSelectorManager } from '../../../src/hooks/use-selector-manager';

export const useSelectorManager = vi
  .fn<typeof orgUseSelectorManager>()
  .mockImplementation(() => ({
    selectorManager: { start: false },
    setSelectorData: vi.fn(),
    startSelector: vi.fn(),
    stopSelector: vi.fn(),
  }));
