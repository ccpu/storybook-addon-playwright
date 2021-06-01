// import { StoriesRaw } from '@storybook/api/dist/modules/stories';

export type StoryData = {
  id: string;
  name: string;
  kind: string;
  children: string[];
  parameters: {
    fileName: string;
    options: {
      // hierarchyRootSeparator: RegExp;
      // hierarchySeparator: RegExp;
      showRoots?: boolean;
      [key: string]: unknown | undefined;
    };
    [parameterName: string]: unknown;
  };
  isLeaf: boolean;
  parent: string;
  story: string;
};
