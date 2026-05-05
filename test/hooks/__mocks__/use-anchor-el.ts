import { useAnchorEl as orgUseAnchorEl } from '../../../src/hooks/use-anchor-el';

export const useAnchorEl = vi.fn<typeof orgUseAnchorEl>();

useAnchorEl.mockImplementation(
  () =>
    ({
      anchorEl: document.createElement('div'),
      anchorElRef: { current: null },
      clearAnchorEl: vi.fn(),
      setAnchorEl: vi.fn(),
    } as unknown as ReturnType<typeof orgUseAnchorEl>),
);
