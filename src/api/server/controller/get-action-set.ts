import { getActionSet as getActionSetService } from '../services/get-action-set';
import { StoryInfo } from '../../../typings';

export const getActionSet = async (req, res): Promise<void> => {
  const reqData = req.body as StoryInfo;
  try {
    const actionSets = await getActionSetService(reqData);
    res.send(JSON.stringify(actionSets));
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
