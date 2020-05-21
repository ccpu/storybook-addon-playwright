import { getStoryScreenshots as getStoryScreenshotsService } from '../services/get-story-screenshots';
import { StoryScreenshotInfo } from '../../typings';
import { Request, Response } from 'express';

export const getStoryScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as StoryScreenshotInfo;

  const snapshotData = await getStoryScreenshotsService(reqData);

  res.json(snapshotData);
};
