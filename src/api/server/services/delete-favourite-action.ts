import { writeFileSync } from 'jsonfile';
import { DeleteFavouriteAction } from '../../typings/delete-favourite-action';
import { FavouriteActions } from '../../typings/favourite-actions';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';
import { getFavouriteActions } from './get-favourite-actions';

export const deleteFavouriteAction = async (
  actionSet: DeleteFavouriteAction,
) => {
  const actionSets = await getFavouriteActions();

  const favouriteActions: FavouriteActions = {
    actionSets: actionSets.filter((x) => x.id !== actionSet.actionSetId),
  };

  writeFileSync(FAVOURITE_ACTIONS_FILE_PATH, favouriteActions, {
    EOL: '\r\n',
    spaces: 2,
  });
};
