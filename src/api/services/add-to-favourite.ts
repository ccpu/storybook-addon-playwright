// const id = nanoid(12);

import { writeFileSync, readFileSync } from 'jsonfile';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';
import { AddFavouriteActionInput, FavouriteActionsData } from '../../schema';

export const addToFavourite = async (
  data: AddFavouriteActionInput,
): Promise<void> => {
  data.id = nanoid(15);

  const favouriteActions: FavouriteActionsData = fs.existsSync(
    FAVOURITE_ACTIONS_FILE_PATH,
  )
    ? (readFileSync(FAVOURITE_ACTIONS_FILE_PATH) as FavouriteActionsData)
    : { actionSets: [] };

  favouriteActions.actionSets.push(data);

  writeFileSync(FAVOURITE_ACTIONS_FILE_PATH, favouriteActions, {
    EOL: '\r\n',
    spaces: 2,
  });
};
