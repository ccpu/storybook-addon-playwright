import { testAppScreenshot as testAppScreenshotService } from '../services/test-app-screenshots';
import { Request, Response } from 'express';

export const testAppScreenshots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const snapshotData = await testAppScreenshotService(req.headers.host);

  res.json(snapshotData);
};
