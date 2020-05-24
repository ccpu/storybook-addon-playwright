const data = {
  id: 'story-id',
  name: 'story-name',
  parameters: {
    fileName: 'story-file.ts',
    options: {},
  },
};

jest.mock('../../src/hooks/use-current-story-data', () => ({
  useCurrentStoryData: () => {
    return data;
  },
}));
