export const useStoryActionSetsLoader = vi.fn().mockImplementation(() => ({
  loading: false,
  retry: vi.fn(),
}));
