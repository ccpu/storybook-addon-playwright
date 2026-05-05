import { executeAction as orgExecuteAction } from '../../../../../src/api/server/utils/execute-action';

export const executeAction = vi.fn<typeof orgExecuteAction>();
