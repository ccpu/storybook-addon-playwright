import { saveActionSet as saveActionSetService } from '../services/save-action-set';
import { SaveActionSetRequest } from '../../typings';

export const saveActionSet = async (req, res): Promise<void> => {
  const reqData = req.body as SaveActionSetRequest;
  try {
    await saveActionSetService(reqData);
    res.send({ success: true });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
