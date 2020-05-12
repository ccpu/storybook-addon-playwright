import { getActionSet as getActionSetService } from '../services/get-action-set';
import { StoryInfo } from '../../../typings';

export const getActionSet = async (req, res): Promise<void> => {
  const reqData = req.body as StoryInfo;
  const actionSets = await getActionSetService(reqData);
  res.json(actionSets);
};
