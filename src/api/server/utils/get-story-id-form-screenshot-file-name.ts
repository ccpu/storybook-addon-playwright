import kebabCase from 'lodash/kebabCase';
import path from 'path';

interface Data {
  storyTitle: string;
  screenshotTitle: string;
  browser: string;
  fileName: string;
}

export const getStoryIdFormScreenshotFileName = (data: Data) => {
  const { screenshotTitle, storyTitle, browser, fileName } = data;

  const screenshotTitleKebabCase = kebabCase(screenshotTitle) as string;
  const storyTitleCase = kebabCase(storyTitle) as string;

  let fileNameNoExtension = path.parse(fileName).name as string;
  fileNameNoExtension = fileNameNoExtension.substring(
    0,
    fileNameNoExtension.length - '-snap'.length,
  );
  fileNameNoExtension = fileNameNoExtension.substring(
    0,
    fileNameNoExtension.length - ('-' + browser).length,
  );
  fileNameNoExtension = fileNameNoExtension.substring(
    0,
    fileNameNoExtension.length - ('-' + screenshotTitleKebabCase).length,
  );
  fileNameNoExtension = fileNameNoExtension.substring(
    storyTitleCase.length + 1,
    fileNameNoExtension.length,
  );

  return fileNameNoExtension;
};
