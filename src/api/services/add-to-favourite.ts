// const id = nanoid(12);

import type {
  AddFavouriteActionInput,
  FavouriteActionsData,
} from '../../schema';
import * as fs from 'node:fs';
import { readFileSync, writeFileSync } from 'jsonfile';
import { nanoid } from 'nanoid';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';

export async function addToFavourite(
  data: AddFavouriteActionInput,
): Promise<void> {
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
}
