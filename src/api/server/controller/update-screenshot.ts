import { updateScreenshot as updateScreenshotClient } from '../services/update-screenshot';
import { Request, Response } from 'express';
import { UpdateScreenshot } from '../../typings';

export const updateScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as UpdateScreenshot;

  const snapshotData = await updateScreenshotClient(reqData);

  res.json(snapshotData);
};
