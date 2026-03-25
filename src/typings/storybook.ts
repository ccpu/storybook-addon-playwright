// import { StoriesRaw } from '@storybook/api/dist/modules/stories';

export type StoryData = {
  id: string;
  name: string;
  importPath: string;
  // kind: string;
  parameters: {
    fileName: string;
  };
  parent: string;
};
