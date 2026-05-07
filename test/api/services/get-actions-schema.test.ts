import { getActionsSchema } from '../../../src/api/services/get-actions-schema';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);

describe('getActionsSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return action schema', async () => {
    const schema = getActionsSchema();
    expect(schema).toBeDefined();
  });

  it('should include custom schema', () => {
    const schema = getActionsSchema();

    expect(schema.clickSelector).toBeDefined();
  });
});
