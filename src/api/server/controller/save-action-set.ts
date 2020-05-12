import { saveActionSet as saveActionSetService } from '../services/save-action-set';
import { SaveActionSetRequest } from '../../typings';
import { Request, Response } from 'express';

export const saveActionSet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as SaveActionSetRequest;
  await saveActionSetService(reqData);
  res.status(200);
  res.end();
};
