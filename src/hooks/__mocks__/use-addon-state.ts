export const useAddonState = vi.fn().mockImplementation(() => {
  return {
    addonState: vi.fn(),
    setAddonState: vi.fn(),
  };
});
