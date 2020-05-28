import { testStoryScreenshot as testStoryScreenshotService } from '../services/test-story-screenshots';
import { Request, Response } from 'express';
import { StoryInfo } from '../../../typings';

export const testStoryScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as StoryInfo;

  const snapshotData = await testStoryScreenshotService(
    reqData,
    req.headers.host,
  );

  res.json(snapshotData);
};
