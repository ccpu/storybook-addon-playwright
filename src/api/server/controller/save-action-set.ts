import { saveActionSet as saveActionSetService } from '../services/save-action-set';
import { SaveActionSetRequest } from '../../typings';

export const saveActionSet = async (req, res): Promise<void> => {
  const reqData = req.body as SaveActionSetRequest;
  try {
    saveActionSetService(reqData);
    // const snapshotData = await makeScreenshot(reqData, req.headers.host, true);
    res.status(200).send();
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
