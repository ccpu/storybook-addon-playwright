import { fixScreenshotFileName as service } from '../services/fix-screenshot-file-name';
import { FixScreenshotFileName } from '../../typings';

export const fixScreenshotFileName = async (req, res): Promise<void> => {
  const reqData = req.body as FixScreenshotFileName;
  const actionSets = await service(reqData);
  res.json(actionSets);
};
