import { getActionsSchema as getActionsSchemaService } from '../services/get-actions-schema';

export const getActionsSchema = async (_req, res): Promise<void> => {
  try {
    const actions = getActionsSchemaService();
    const json = JSON.stringify(actions);
    res.send(json);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
