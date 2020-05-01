import { getActionsData as getActionsDataService } from '../services/get-actions-data';

export const getActionsData = async (_req, res): Promise<void> => {
  try {
    const actions = getActionsDataService();
    res.send(actions);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
