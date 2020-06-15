import { testAppScreenshots as testAppScreenshotService } from '../services/test-app-screenshots';
import { Request, Response } from 'express';

export const testAppScreenshots = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const snapshotData = await testAppScreenshotService();

  res.json(snapshotData);
};
