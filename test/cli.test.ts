import { runPropsToArgsMigration } from '../src/api/server/migration/props-to-args-migration';
import { runCli } from '../src/cli';

vi.mock('../src/api/server/migration/props-to-args-migration', () => ({
  runPropsToArgsMigration: vi.fn(),
}));

describe('cli', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs props-to-args migration command', () => {
    vi.mocked(runPropsToArgsMigration).mockReturnValue({
      changedFiles: ['a.playwright.json'],
      scannedFiles: 3,
    });
    const logSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const exitCode = runCli(['migrate', 'props-to-args']);

    expect(exitCode).toBe(0);
    expect(runPropsToArgsMigration).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('a.playwright.json');
  });

  it('prints usage for unknown commands', () => {
    const logSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const exitCode = runCli(['unknown']);

    expect(exitCode).toBe(1);
    expect(runPropsToArgsMigration).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Usage: storybook-addon-playwright'),
    );
  });
});
