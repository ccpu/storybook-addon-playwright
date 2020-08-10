const writeFileMock = jest.fn();
jest.mock('jsonfile', () => ({
  writeFileSync: writeFileMock,
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
    saveStoryFile(fileInfo, {
      stories: {
        'story-id': {
          actionSets: [{ actions: [], id: 'id', title: 'desc' }],
        },
      },
    });

    expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileMock.mock.calls[0][1]).toStrictEqual({
      stories: {
        'story-id': {
          actionSets: [{ actions: [], id: 'id', title: 'desc' }],
        },
      },
      version: '2',
    });
  });

  it('should remove empty story', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    saveStoryFile(fileInfo, {
      stories: {
        'story-id': {
          actionSets: [{ actions: [], id: 'id', title: 'desc' }],
        },
        'story-id_2': {},
      },
    });

    expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileMock.mock.calls[0][1]).toStrictEqual({
      stories: {
        'story-id': {
          actionSets: [{ actions: [], id: 'id', title: 'desc' }],
        },
      },
      version: '2',
    });
  });
  it('should remove file if received empty object', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    saveStoryFile(fileInfo, {});

    expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(0);

    expect(unlinkSync).toHaveBeenCalledTimes(1);
  });
});
