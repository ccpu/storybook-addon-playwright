import { StoryData } from '../../src/schema';

export const storyData: StoryData = {
  filePath: './test.stories.tsx',
  id: 'story-id',
  importPath: './test.stories.tsx',
  isLeaf: true,
  kind: 'Component',
  name: 'With Component',
  parameters: {
    __id: 'story-id',
    component: {
      displayName: 'Component',
    },
    fileName: './test.stories.tsx',
    framework: 'react',
  },
  parent: 'component',
  story: 'With Component',
} as unknown as StoryData;

export const getStoryData = (): StoryData => storyData;
