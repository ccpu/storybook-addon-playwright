import type { GenerateScreenshotTitleInput } from '../../schema';
import { getConfigs } from '../server/configs';

export async function generateScreenshotTitle(
  data: GenerateScreenshotTitleInput,
): Promise<string> {
  const { getScreenshotTitle } = getConfigs();

  if (!getScreenshotTitle) {
    throw new Error('getScreenshotTitle is not configured.');
  }

  return getScreenshotTitle({
    ...data,
  });
}
