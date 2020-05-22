import { saveScreenshot as saveScreenshotService } from '../services/save-screenshot';
import { SaveScreenshotRequest } from '../../typings';
import { Request, Response } from 'express';

export const saveScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as SaveScreenshotRequest;

  const result = await saveScreenshotService(reqData);

  res.json(result);
};
