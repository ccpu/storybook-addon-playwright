export const useStoryActionSetsLoaderMock =
  vi.fn<(...args: unknown[]) => unknown>();

vi.mock(
  '../../../src/features/action-set/hooks/use-story-action-sets-loader',
  () => ({
    useStoryActionSetsLoader: useStoryActionSetsLoaderMock,
  }),
);

export const useStoryActionSetsLoaderRetryMock =
  vi.fn<(...args: unknown[]) => unknown>();

useStoryActionSetsLoaderMock.mockImplementation(() => ({
  error: undefined,
  loading: false,
  retry: useStoryActionSetsLoaderRetryMock,
}));
