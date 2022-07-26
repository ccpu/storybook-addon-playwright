import { DeleteFavouriteAction } from '../../typings/delete-favourite-action';
import { deleteFavouriteAction as deleteFavouriteActionService } from '../services/delete-favourite-action';

export const deleteFavouriteAction = async (req, res): Promise<void> => {
  const reqData = req.body as DeleteFavouriteAction;
  await deleteFavouriteActionService(reqData);
  res.status(200);
  res.end();
};
