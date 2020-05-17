export const useStoryActionSetsLoaderMock = jest.fn();

jest.mock('../../../src/hooks/use-story-action-sets-loader', () => ({
  useStoryActionSetsLoader: useStoryActionSetsLoaderMock,
}));

export const useStoryActionSetsLoaderRetryMock = jest.fn();

useStoryActionSetsLoaderMock.mockImplementation(() => ({
  error: undefined,
  loading: false,
  retry: useStoryActionSetsLoaderRetryMock,
}));
