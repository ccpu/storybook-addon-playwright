import * as path from 'path';

export interface StoryFileInfo {
  name: string;
  path: string;
}

export const getStoryFileInfo = (relativeFilePath: string) => {
  const absolutePath = path.resolve(relativeFilePath);
  const parsedFileName = path.parse(absolutePath);
  const name = `${parsedFileName.name}.json`;
  return {
    name: name,
    path: path.join(path.dirname(absolutePath), name),
  };
};
