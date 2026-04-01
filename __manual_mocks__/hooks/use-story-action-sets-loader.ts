export const useStoryActionSetsLoaderMock = vi.fn();

vi.mock(
  '../../src/features/action-set/hooks/use-story-action-sets-loader',
  () => ({
    useStoryActionSetsLoader: useStoryActionSetsLoaderMock,
  }),
);

export const useStoryActionSetsLoaderRetryMock = vi.fn();

useStoryActionSetsLoaderMock.mockImplementation(() => ({
  error: undefined,
  loading: false,
  retry: useStoryActionSetsLoaderRetryMock,
}));
