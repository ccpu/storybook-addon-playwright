import type { GenerateScreenshotTitleInput } from '../../schema';
import fs from 'node:fs';
import path from 'node:path';
import { getConfigs } from '../server/configs';

export async function generateScreenshotTitle(
  data: GenerateScreenshotTitleInput,
): Promise<string> {
  const { getScreenshotTitle } = getConfigs();

  if (!getScreenshotTitle) {
    throw new Error('getScreenshotTitle is not configured.');
  }

  let storySource: string | undefined;
  try {
    storySource = fs.readFileSync(path.resolve(data.filePath), 'utf-8');
  } catch {
    // file may not be readable; storySource stays undefined
  }

  return getScreenshotTitle({
    ...data,
    storySource,
  });
}
