import { deleteActionSet as deleteActionSetService } from '../services/delete-action-set';
import { DeleteActionSetRequest } from '../../typings';

export const deleteActionSet = async (req, res): Promise<void> => {
  const reqData = req.body as DeleteActionSetRequest;
  try {
    await deleteActionSetService(reqData);
    res.send({ success: true });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
