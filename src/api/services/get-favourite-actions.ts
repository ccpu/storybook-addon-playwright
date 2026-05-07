import type { FavouriteActionsData } from '../../schema';
import type { FavouriteActionSet } from '../../typings';
import * as fs from 'node:fs';
import { readFile } from 'jsonfile';
import { FAVOURITE_ACTIONS_FILE_PATH } from './constants';

export async function getFavouriteActions(): Promise<FavouriteActionSet[]> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FAVOURITE_ACTIONS_FILE_PATH)) {
      resolve([]);
      return;
    }

    readFile(
      FAVOURITE_ACTIONS_FILE_PATH,
      (err, data?: FavouriteActionsData) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data?.actionSets ?? []);
      },
    );
  });
}
