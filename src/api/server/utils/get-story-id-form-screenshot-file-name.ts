import path from 'node:path';
import kebabCase from 'lodash/kebabCase';

interface Data {
  storyTitle: string;
  screenshotTitle: string;
  browser: string;
  fileName: string;
}

export function getStoryIdFormScreenshotFileName(data: Data) {
  const { screenshotTitle, storyTitle, browser, fileName } = data;

  const screenshotTitleKebabCase = kebabCase(screenshotTitle);
  const storyTitleCase = kebabCase(storyTitle);

  let fileNameNoExtension = path.parse(fileName).name;
  fileNameNoExtension = fileNameNoExtension.substring(
    0,
    fileNameNoExtension.length - '-snap'.length,
  );
  fileNameNoExtension = fileNameNoExtension.substring(
    0,
    fileNameNoExtension.length - `-${browser}`.length,
  );
  fileNameNoExtension = fileNameNoExtension.substring(
    0,
    fileNameNoExtension.length - `-${screenshotTitleKebabCase}`.length,
  );
  fileNameNoExtension = fileNameNoExtension.substring(
    storyTitleCase.length + 1,
    fileNameNoExtension.length,
  );

  return fileNameNoExtension;
}
