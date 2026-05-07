import type {
  DeleteFavouriteActionInput,
  FavouriteActionsData,
} from '../../schema';
import { writeFileSync } from 'jsonfile';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';
import { getFavouriteActions } from './get-favourite-actions';

export async function deleteFavouriteAction(
  actionSet: DeleteFavouriteActionInput,
) {
  const actionSets = await getFavouriteActions();

  const favouriteActions: FavouriteActionsData = {
    actionSets: actionSets.filter((x) => x.id !== actionSet.actionSetId),
  };

  writeFileSync(FAVOURITE_ACTIONS_FILE_PATH, favouriteActions, {
    EOL: '\r\n',
    spaces: 2,
  });
}
