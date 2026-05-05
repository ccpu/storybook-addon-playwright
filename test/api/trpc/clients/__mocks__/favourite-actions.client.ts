import { addToFavourite as orgAddFavouriteAction } from '../../../../../src/api/services/add-to-favourite';
import { getFavouriteActions as orgGetFavouriteActions } from '../../../../../src/api/services/get-favourite-actions';
import { deleteFavouriteAction as orgDeleteFavouriteAction } from '../../../../../src/api/services/delete-favourite-action';

export const addFavouriteAction = vi.fn<typeof orgAddFavouriteAction>();
export const getFavouriteActions = vi.fn<typeof orgGetFavouriteActions>();
export const deleteFavouriteAction = vi.fn<typeof orgDeleteFavouriteAction>();
