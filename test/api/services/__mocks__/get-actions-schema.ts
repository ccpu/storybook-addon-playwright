import { getActionsSchema as orgGetActionsSchema } from '../../../../src/api/services/get-actions-schema';

const getActionsSchema = vi.fn<typeof orgGetActionsSchema>();

export { getActionsSchema };
