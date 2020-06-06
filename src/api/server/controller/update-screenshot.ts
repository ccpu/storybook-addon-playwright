import { updateScreenshotService } from '../services/update-screenshot-service';
import { Request, Response } from 'express';
import { UpdateScreenshot } from '../../typings';

export const updateScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as UpdateScreenshot;

  const snapshotData = await updateScreenshotService(reqData);

  res.json(snapshotData);
};
