const writeFileMock = jest.fn();
jest.mock('jsonfile', () => ({
  writeFile: writeFileMock,
}));

import { saveStoryFile } from '../save-story-file';
import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';
import * as jsonfile from 'jsonfile';
import { unlinkSync } from 'fs';

jest.mock('fs');

describe('saveStoryFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    await saveStoryFile(fileInfo, {
      stories: {
        'story-id': {
          actionSets: [{ actions: [], description: 'desc', id: 'id' }],
        },
      },
    });

    expect(jsonfile.writeFile).toHaveBeenCalledTimes(1);
    expect(writeFileMock.mock.calls[0][1]).toStrictEqual({
      'story-id': {
        actionSets: [{ actions: [], description: 'desc', id: 'id' }],
      },
    });
  });

  it('should remove empty story', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    await saveStoryFile(fileInfo, {
      stories: {
        'story-id': {
          actionSets: [{ actions: [], description: 'desc', id: 'id' }],
        },
      },
      'story-id_2': {},
    });

    expect(jsonfile.writeFile).toHaveBeenCalledTimes(1);
    expect(writeFileMock.mock.calls[0][1]).toStrictEqual({
      'story-id': {
        actionSets: [{ actions: [], description: 'desc', id: 'id' }],
      },
    });
  });
  it('should remove file if received empty object', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    await saveStoryFile(fileInfo, {});

    expect(jsonfile.writeFile).toHaveBeenCalledTimes(0);

    expect(unlinkSync).toHaveBeenCalledTimes(1);
  });
});
