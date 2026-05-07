import { MatchImageSnapshotOptions, toMatchImageSnapshot } from 'jest-image-snapshot';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { getScreenshots } from './get-screenshots';

expect.extend({ toMatchImageSnapshot });

export async function toMatchScreenshots(
  playwrightJsonPath?: string,
  options?: MatchImageSnapshotOptions,
) {
  const { testPath } = this;

  const testDirParsed = path.parse(testPath);
  const testDir = testDirParsed.dir;

  const resolvedPath = playwrightJsonPath
    ? path.resolve(path.join(testDir, playwrightJsonPath))
    : undefined;

  const configRelative = resolvedPath
    ? path.relative(process.cwd(), resolvedPath).replace(/\\/g, '/')
    : undefined;

  try {
    await getScreenshots({
      onScreenshotReady: (screenshotBuffer, baselineScreenshotPath) => {
        try {
          expect(screenshotBuffer).toMatchImageSnapshot({
            ...options,
            customSnapshotIdentifier: baselineScreenshotPath.screenshotIdentifier,
            customSnapshotsDir: baselineScreenshotPath.screenshotsDir,
          });
        } catch (error) {
          throw (error as { message: string }).message;
        }
      },
      playwrightJsonPath:
        playwrightJsonPath === '*' ? playwrightJsonPath : configRelative,
      requestId: nanoid(),
    });
  } catch (error) {
    return {
      message: () => error,
      pass: false,
    };
  }
  return {
    message: () => 'expected page screenshot to match.',
    pass: true,
  };
}
