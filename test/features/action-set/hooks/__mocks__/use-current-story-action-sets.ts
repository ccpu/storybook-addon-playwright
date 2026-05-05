export const useCurrentStoryActionSets = vi
  .fn<
    () => {
      currentActionSets: string[];
      state: Record<string, unknown>;
      storyActionSets: unknown[];
    }
  >()
  .mockImplementation(() => ({
    currentActionSets: [],
    state: {},
    storyActionSets: [],
  }));
