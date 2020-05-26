import { testScreenshot as testScreenshotService } from '../services/test-screenShot';
import { Request, Response } from 'express';
import { ScreenshotInfo } from '../../../typings';

export const testScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as ScreenshotInfo;

  const snapshotData = await testScreenshotService(reqData, req.headers.host);

  res.json(snapshotData);
};
