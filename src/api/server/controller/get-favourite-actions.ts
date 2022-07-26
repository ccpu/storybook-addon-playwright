import { getFavouriteActions as getFavouriteActionsService } from '../services/get-favourite-actions';
import { Request, Response } from 'express';

export const getFavouriteActions = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const result = await getFavouriteActionsService();

  res.json(result);
};
