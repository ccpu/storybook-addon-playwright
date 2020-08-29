import { testScreenshots as testAppScreenshotService } from '../services/test-screenshots';
import { Request, Response } from 'express';
import { TestScreenShots } from '../../typings';

export const testScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as TestScreenShots;
  const snapshotData = await testAppScreenshotService(reqData);

  res.json(snapshotData);
};
