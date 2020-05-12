import { saveScreenshot as saveScreenshotService } from '../services/save-snapshot-data';
import { SaveScreenshot } from '../../typings';
import { Request, Response } from 'express';

export const saveScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as SaveScreenshot;

  await saveScreenshotService(reqData);

  res.status(200);
  res.end();
};
