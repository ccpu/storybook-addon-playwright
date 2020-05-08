import { SaveActionSetRequest } from '../../typings';

export const saveActionSet = async (
  req: SaveActionSetRequest,
): Promise<void> => {
  console.log(req);
};
