import { testScreenshotService } from '../services/test-screenshot-service';
import { Request, Response } from 'express';
import { ScreenshotInfo } from '../../../typings';
import { RequestData } from '../../../typings/request';

export const testScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as ScreenshotInfo & RequestData;

  const snapshotData = await testScreenshotService(reqData);

  res.json(snapshotData);
};
