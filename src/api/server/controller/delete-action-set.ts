import { deleteActionSet as deleteActionSetService } from '../services/delete-action-set';
import { DeleteActionSetRequest } from '../../typings';
import { Response, Request } from 'express';

export const deleteActionSet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as DeleteActionSetRequest;
  await deleteActionSetService(reqData);
  res.status(200);
  res.end();
};
