import { getActionsSchema as orgGetActionsSchema } from '../../../../../src/api/services/get-actions-schema';
import { getSchemaService as orgGetSchema } from '../../../../../src/api/services/get-schema-service';

export const getActionsSchema = vi.fn<typeof orgGetActionsSchema>();
export const getSchema = vi.fn<typeof orgGetSchema>();
