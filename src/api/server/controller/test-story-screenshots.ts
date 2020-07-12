import { testStoryScreenshots as testStoryScreenshotService } from '../services/test-story-screenshots';
import { Request, Response } from 'express';
import { StoryInfo } from '../../../typings';
import { RequestData } from '../../../typings/request';

export const testStoryScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as StoryInfo & RequestData;

  const snapshotData = await testStoryScreenshotService(reqData);

  res.json(snapshotData);
};
