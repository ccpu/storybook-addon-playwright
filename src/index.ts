import { getPlaywrightConfigFiles } from './utils/get-playwright-config-files';
import { testScreenshots } from './api/server/services/test-screenshots';

interface RunImageDiffOptions {
  onComplete?: () => Promise<void>;
}

export const runImageDiff = async (
  playwrightConfigPath: string,
  options?: RunImageDiffOptions,
) => {
  const files = await getPlaywrightConfigFiles(playwrightConfigPath);

  // const pages = ;
  // const page: { [browserName: string]: Page } = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const storyData = await testScreenshots({
      fileName: file,
    });
    console.log(storyData);
  }
  if (options.onComplete) {
    options.onComplete();
  }

  return files;
};
