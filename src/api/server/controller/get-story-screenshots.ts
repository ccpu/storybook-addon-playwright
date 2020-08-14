import { getStoryScreenshotsData as getStoryScreenshotsService } from '../services/get-story-screenshots-data';
import { Request, Response } from 'express';
import { StoryInfo } from '../../../typings';

export const getStoryScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as StoryInfo;

  const snapshotData = await getStoryScreenshotsService(reqData);

  res.json(snapshotData);
};
