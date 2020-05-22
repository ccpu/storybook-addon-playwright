import { ScreenshotInfo } from '../../../typings';
import { deleteScreenshot as deleteScreenshotService } from '../services/delete-screenshot';

export const deleteScreenshot = async (req, res): Promise<void> => {
  const reqData = req.body as ScreenshotInfo;
  await deleteScreenshotService(reqData);
  res.status(200);
  res.end();
};
