export const useAddonState = jest.fn().mockImplementation(() => {
  return {
    addonState: jest.fn(),
    setAddonState: jest.fn(),
  };
});
