import { getActionsSchema as getActionsSchemaService } from '../services/get-actions-schema';

export const getActionsSchema = async (_req, res): Promise<void> => {
  const actions = getActionsSchemaService();
  res.json(actions);
};
