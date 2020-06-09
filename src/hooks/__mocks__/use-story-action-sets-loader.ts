export const useStoryActionSetsLoader = jest.fn().mockImplementation(() => ({
  loading: false,
  retry: jest.fn(),
}));
