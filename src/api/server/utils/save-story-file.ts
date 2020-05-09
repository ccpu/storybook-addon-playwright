import { StoryFileInfo } from './get-story-file-info';
import { StoryData } from '../../../typings';
import { writeFile } from 'jsonfile';

export const saveStoryFile = async (
  fileInfo: StoryFileInfo,
  data: StoryData,
) => {
  await writeFile(fileInfo.path, data, { EOL: '\r\n', spaces: 2 });
};
