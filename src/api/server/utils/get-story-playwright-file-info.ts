import * as path from 'path';

export interface StoryPlaywrightFileInfo {
  name: string;
  path: string;
  dir: string;
}

export const getStoryPlaywrightFileInfo = (storyRelativeFilePath: string) => {
  const absolutePath = path.resolve(storyRelativeFilePath);
  const parsedFileName = path.parse(absolutePath);
  const name =
    parsedFileName.ext === '.json'
      ? `${parsedFileName.name}.json`
      : `${parsedFileName.name}.playwright.json`;
  return {
    dir: parsedFileName.dir,
    name: name,
    path: path.join(path.dirname(absolutePath), name),
    screenShotsDir: path.join(parsedFileName.dir, '__screenshots__'),
  };
};
