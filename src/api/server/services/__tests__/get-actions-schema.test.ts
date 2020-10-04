/* eslint-disable @typescript-eslint/no-unused-vars */
import { getActionsSchema } from '../get-actions-schema';

jest.mock('../../configs');

describe('getActionsSchema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return action schema', async () => {
    const schema = getActionsSchema();
    expect(schema).toBeDefined();
  });

  it('should include custom schema', () => {
    const schema = getActionsSchema();

    expect(schema['clickSelector']).toBeDefined();
  });
});
