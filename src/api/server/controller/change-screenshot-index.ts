import { changeScreenshotIndex as changeScreenShotIndexClient } from '../services/change-screenshot-index';
import { ChangeScreenshotIndex } from '../../typings';
import { Response, Request } from 'express';

export const changeScreenShotIndex = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as ChangeScreenshotIndex;
  await changeScreenShotIndexClient(reqData);
  res.status(200);
  res.end();
};
