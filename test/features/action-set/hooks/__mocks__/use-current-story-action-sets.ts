export const useCurrentStoryActionSets: () => {
  currentActionSets: string[];
  state: Record<string, unknown>;
  storyActionSets: unknown[];
} = vi.fn().mockImplementation(() => ({
  currentActionSets: [],
  state: {},
  storyActionSets: [],
}));
