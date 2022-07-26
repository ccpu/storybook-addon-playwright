// const id = nanoid(12);
import { ActionSet } from '../../../typings/story-action';
import { writeFileSync, readFileSync } from 'jsonfile';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';
import { FavouriteActions } from '../../typings/favourite-actions';

export const addToFavourite = async (data: ActionSet): Promise<void> => {
  data.id = nanoid(15);

  const favouriteActions: FavouriteActions = fs.existsSync(
    FAVOURITE_ACTIONS_FILE_PATH,
  )
    ? (readFileSync(FAVOURITE_ACTIONS_FILE_PATH) as FavouriteActions)
    : { actionSets: [] };

  favouriteActions.actionSets.push(data);

  writeFileSync(FAVOURITE_ACTIONS_FILE_PATH, favouriteActions, {
    EOL: '\r\n',
    spaces: 2,
  });
};
