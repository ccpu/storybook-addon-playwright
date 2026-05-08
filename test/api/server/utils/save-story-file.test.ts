// Changed: vi.hoisted() ensures the variable is initialized before the Mock
// factory runs (vitest hoists vi.mock to before all declarations, causing TDZ).
const writeFileMock = vi.hoisted(() => vi.fn());
vi.mock('jsonfile', () => ({
  writeFileSync: writeFileMock,
}));

import { saveStoryFile } from '../../../../src/api/server/utils/save-story-file';
import { getStoryPlaywrightFileInfo } from '../../../../src/api/server/utils/get-story-playwright-file-info';
import * as jsonfile from 'jsonfile';
import { unlinkSync } from 'node:fs';

vi.mock('node:fs');

describe('saveStoryFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      version: '5',
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
      version: '5',
    });
  });
  it('should remove file if received empty object', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    saveStoryFile(fileInfo, {});

    expect(jsonfile.writeFileSync).toHaveBeenCalledTimes(0);

    expect(unlinkSync).toHaveBeenCalledTimes(1);
  });
});
