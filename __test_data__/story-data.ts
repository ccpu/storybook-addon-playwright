import { StoryData } from '../src/typings';

export const storyData: StoryData = ({
  id: 'story-id',
  isLeaf: true,
  kind: 'Component',
  name: 'With Component',
  parameters: {
    __id: 'story-id',
    component: {
      displayName: 'Component',
    },
    fileName: './src/stories/story.stories.tsx',
    framework: 'react',
  },
  parent: 'component',
  story: 'With Component',
} as unknown) as StoryData;

export const getStoryData = (): StoryData => storyData;
