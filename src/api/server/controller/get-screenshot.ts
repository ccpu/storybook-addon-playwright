import { makeScreenshot } from '../services/make-screenshot';
import { ScreenshotRequest, GetScreenshotResponse } from '../../typings';
import { Request, Response } from 'express';

export const getScreenshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as ScreenshotRequest;

  const snapshotData = await makeScreenshot(reqData, true);

  res.json({ base64: snapshotData.base64 } as GetScreenshotResponse);
};
