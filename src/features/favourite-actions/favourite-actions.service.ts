// Service functions re-exported from the existing service layer.
// Do not change service logic — only rename and relocate.

export { addToFavourite as addFavouriteAction } from '../../api/server/services/add-to-favourite';
export { getFavouriteActions } from '../../api/server/services/get-favourite-actions';
export { deleteFavouriteAction } from '../../api/server/services/delete-favourite-action';
