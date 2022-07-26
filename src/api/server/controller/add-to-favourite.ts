import { addToFavourite as addToFavouriteService } from '../services/add-to-favourite';
import { Request, Response } from 'express';
import { ActionSet } from '../../../typings';

export const addToFavourite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reqData = req.body as ActionSet;

  await addToFavouriteService(reqData);

  res.status(200);
  res.end();
};
