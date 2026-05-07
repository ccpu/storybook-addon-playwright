import glob from 'fast-glob';
import { readFileSync, writeFileSync } from 'jsonfile';
import { PlaywrightData } from '../../../../src/typings';
import {
  migratePropsToArgsData,
  runPropsToArgsMigration,
} from '../../../../src/api/server/migration/props-to-args-migration';

vi.mock('fast-glob', () => ({
  default: {
    sync: vi.fn(),
  },
}));

vi.mock('jsonfile', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe('props-to-args migration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('moves props to args and removes props', () => {
    const data: PlaywrightData = {
      stories: {
        id: {
          screenshots: [
            {
              browserType: 'chromium' as const,
              id: 's1',
              props: { color: 'red' },
              title: 'shot',
            },
          ],
        },
      },
    };

    const changed = migratePropsToArgsData(data);

    expect(changed).toBe(true);
    expect(data.stories!.id.screenshots![0]).toEqual({
      args: { color: 'red' },
      browserType: 'chromium',
      id: 's1',
      title: 'shot',
    });
  });

  it('keeps existing args when removing props', () => {
    const data: PlaywrightData = {
      stories: {
        id: {
          screenshots: [
            {
              args: { color: 'blue' },
              browserType: 'chromium' as const,
              id: 's1',
              props: { color: 'red' },
              title: 'shot',
            },
          ],
        },
      },
    };

    migratePropsToArgsData(data);

    expect(data.stories!.id.screenshots![0]).toEqual({
      args: { color: 'blue' },
      browserType: 'chromium',
      id: 's1',
      title: 'shot',
    });
  });

  it('rewrites only changed files when running migration', () => {
    vi.mocked(glob.sync).mockReturnValue([
      'C:\\repo\\a.playwright.json',
      'C:\\repo\\b.playwright.json',
    ]);

    vi.mocked(readFileSync)
      .mockReturnValueOnce({
        stories: {
          s1: {
            screenshots: [
              {
                browserType: 'chromium',
                id: 'shot-1',
                props: { x: 1 },
                title: 'with props',
              },
            ],
          },
        },
      })
      .mockReturnValueOnce({
        stories: {
          s2: {
            screenshots: [
              {
                args: { x: 1 },
                browserType: 'chromium',
                id: 'shot-2',
                title: 'already args',
              },
            ],
          },
        },
      });

    const result = runPropsToArgsMigration('C:\\repo');

    expect(result).toEqual({
      changedFiles: ['a.playwright.json'],
      scannedFiles: 2,
    });
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileSync).toHaveBeenCalledWith(
      'C:\\repo\\a.playwright.json',
      {
        stories: {
          s1: {
            screenshots: [
              {
                args: { x: 1 },
                browserType: 'chromium',
                id: 'shot-1',
                title: 'with props',
              },
            ],
          },
        },
      },
      {
        EOL: '\r\n',
        spaces: 2,
      },
    );
  });
});
