import { runPropsToArgsMigration } from '../src/api/server/migration/props-to-args-migration';
import { runCli } from '../src/cli';

vi.mock('../src/api/server/migration/props-to-args-migration', () => ({
  runPropsToArgsMigration: vi.fn(),
}));

function jsonResponse(data: unknown, status = 200): Response {
  return {
    json: async () => ({ result: { data } }),
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify({ result: { data } }),
  } as unknown as Response;
}

describe('cli', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('runs props-to-args migration command', () => {
    vi.mocked(runPropsToArgsMigration).mockReturnValue({
      changedFiles: ['a.playwright.json'],
      scannedFiles: 3,
    });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const exitCode = runCli(['migrate', 'props-to-args']);

    expect(exitCode).toBe(0);
    expect(runPropsToArgsMigration).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('a.playwright.json');
  });

  it('prints usage for unknown commands', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const exitCode = runCli(['unknown']);

    expect(exitCode).toBe(1);
    expect(runPropsToArgsMigration).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });

  describe('generate', () => {
    it('prints usage when no file and no --all is given', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      const exitCode = await runCli(['generate']);

      expect(exitCode).toBe(1);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('generate'));
    });

    it('reports Storybook not running (exit 0) when the server is unreachable', async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
      vi.stubGlobal('fetch', fetchMock);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      const exitCode = await runCli(['generate', 'Input.stories.playwright.json']);

      expect(exitCode).toBe(0);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const message = logSpy.mock.calls.map((c) => String(c[0])).join('\n');
      expect(message).toContain('not reachable');
      expect(message).toContain('do not attempt recovery');
    });

    it('reports generated baselines on success', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(
          jsonResponse([{ added: true, screenshotIdentifier: 'input--default' }]),
        );
      vi.stubGlobal('fetch', fetchMock);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      const exitCode = await runCli(['generate', 'Input.stories.playwright.json']);

      expect(exitCode).toBe(0);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toContain('/__storybook_playwright/trpc/screenshot.testScreenshots');
      expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
        filePath: 'Input.stories.playwright.json',
        requestType: 'file',
      });
      expect(logSpy.mock.calls.map((c) => String(c[0])).join('\n')).toContain(
        'Generated 1 new baseline',
      );
    });

    it('returns exit 1 when an existing baseline does not match', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(
          jsonResponse([{ pass: false, screenshotIdentifier: 'input--default' }]),
        );
      vi.stubGlobal('fetch', fetchMock);
      vi.spyOn(console, 'log').mockImplementation(() => undefined);

      const exitCode = await runCli(['generate', 'Input.stories.playwright.json']);

      expect(exitCode).toBe(1);
    });

    it('sends requestType "story" when --story is passed', async () => {
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
      vi.stubGlobal('fetch', fetchMock);
      vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await runCli([
        'generate',
        'Input.stories.playwright.json',
        '--story',
        'shadcn-ui-input--default',
      ]);

      const [, init] = fetchMock.mock.calls[0];
      expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
        requestType: 'story',
        storyId: 'shadcn-ui-input--default',
      });
    });
  });
});
