import { testAppScreenshots as testAppScreenshotService } from '../services/test-app-screenshots';
import { Request, Response } from 'express';
import { RequestData } from '../../../typings/request';

export const testAppScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as RequestData;
  const snapshotData = await testAppScreenshotService(reqData);

  res.json(snapshotData);
};
