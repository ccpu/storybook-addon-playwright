import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import glob from 'fast-glob';
import * as configModule from '../../src/api/server/configs';
import { getPlaywrightConfigFiles } from '../../src/utils/get-playwright-config-files';

vi.mock('fast-glob', () => ({
  default: vi.fn(),
}));

function createTmpDir(prefix = 'storybook-addon-playwright-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe('getPlaywrightConfigFiles', () => {
  const tempDirs: string[] = [];

  beforeEach(() => {
    vi.mocked(glob).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    tempDirs.forEach((dirPath) => {
      fs.rmSync(dirPath, { force: true, recursive: true });
    });

    tempDirs.length = 0;
  });

  it('discovers playwright files from cwd by default', async () => {
    const cwd = createTmpDir();
    tempDirs.push(cwd);

    const storiesDir = path.join(cwd, 'stories');
    fs.mkdirSync(storiesDir, { recursive: true });
    fs.writeFileSync(path.join(storiesDir, 'Button.stories.playwright.json'), '{}');

    vi.mocked(glob).mockResolvedValue(['stories/Button.stories.playwright.json']);

    const files = await getPlaywrightConfigFiles(undefined, { cwd });

    expect(files).toContain('stories/Button.stories.playwright.json');
  });

  it('includes files derived from storybook HTTP index entries', async () => {
    const repoRoot = createTmpDir();
    tempDirs.push(repoRoot);

    const cwd = path.join(repoRoot, 'tooling', 'storybook');
    const storyFileDir = path.join(repoRoot, 'packages', 'shadcn-ui', 'stories');

    fs.mkdirSync(cwd, { recursive: true });
    fs.mkdirSync(storyFileDir, { recursive: true });
    fs.writeFileSync(path.join(storyFileDir, 'Alert.stories.playwright.json'), '{}');

    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        entries: {
          alert: {
            importPath: '../../packages/shadcn-ui/stories/Alert.stories.tsx',
          },
        },
      }),
      ok: true,
    });

    vi.stubGlobal('fetch', fetchMock);

    const files = await getPlaywrightConfigFiles(undefined, {
      cwd,
      storybookEndpoint: 'http://127.0.0.1:6006',
    });

    expect(files).toContain(
      '../../packages/shadcn-ui/stories/Alert.stories.playwright.json',
    );
    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:6006/index.json');
  });

  it('reads storybookEndpoint from global config when option is not provided', async () => {
    const repoRoot = createTmpDir();
    tempDirs.push(repoRoot);

    const cwd = path.join(repoRoot, 'tooling', 'storybook');
    const storyFileDir = path.join(repoRoot, 'packages', 'shadcn-ui', 'stories');

    fs.mkdirSync(cwd, { recursive: true });
    fs.mkdirSync(storyFileDir, { recursive: true });
    fs.writeFileSync(path.join(storyFileDir, 'Avatar.stories.playwright.json'), '{}');

    vi.spyOn(configModule, 'getConfigs').mockReturnValue({
      storybookEndpoint: 'http://127.0.0.1:6006',
    } as ReturnType<typeof configModule.getConfigs>);

    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        entries: {
          avatar: {
            importPath: '../../packages/shadcn-ui/stories/Avatar.stories.tsx',
          },
        },
      }),
      ok: true,
    });

    vi.stubGlobal('fetch', fetchMock);

    const files = await getPlaywrightConfigFiles(undefined, { cwd });

    expect(files).toContain(
      '../../packages/shadcn-ui/stories/Avatar.stories.playwright.json',
    );
  });

  it('includes files derived from storybook static index path', async () => {
    const repoRoot = createTmpDir();
    tempDirs.push(repoRoot);

    const cwd = path.join(repoRoot, 'tooling', 'storybook');
    const staticDir = path.join(cwd, 'storybook-static');
    const storyFileDir = path.join(repoRoot, 'packages', 'shadcn-auth', 'stories');

    fs.mkdirSync(cwd, { recursive: true });
    fs.mkdirSync(staticDir, { recursive: true });
    fs.mkdirSync(storyFileDir, { recursive: true });

    fs.writeFileSync(path.join(storyFileDir, 'Login.stories.playwright.json'), '{}');
    fs.writeFileSync(
      path.join(staticDir, 'index.json'),
      JSON.stringify({
        entries: {
          login: {
            importPath: '../../packages/shadcn-auth/stories/Login.stories.tsx',
          },
        },
      }),
    );

    const files = await getPlaywrightConfigFiles(undefined, {
      cwd,
      storybookEndpoint: staticDir,
    });

    expect(files).toContain(
      '../../packages/shadcn-auth/stories/Login.stories.playwright.json',
    );
  });

  it('does not query storybook index when explicit configPath is provided', async () => {
    const cwd = createTmpDir();
    tempDirs.push(cwd);

    const storiesDir = path.join(cwd, 'stories');
    fs.mkdirSync(storiesDir, { recursive: true });
    fs.writeFileSync(path.join(storiesDir, 'Input.stories.playwright.json'), '{}');

    vi.mocked(glob).mockResolvedValue(['stories/Input.stories.playwright.json']);

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const files = await getPlaywrightConfigFiles('stories/*.playwright.json', {
      cwd,
      storybookEndpoint: 'http://127.0.0.1:6006',
    });

    expect(files).toEqual(['stories/Input.stories.playwright.json']);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
