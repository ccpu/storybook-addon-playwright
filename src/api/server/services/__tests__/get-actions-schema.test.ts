import { getActionsSchema } from '../get-actions-schema';
import * as schemaGenerator from '../get-actions-schema';
import { spyOnGetConfig } from './mocks';

describe('getActionsSchema', () => {
  beforeEach(() => {
    spyOnGetConfig.mockClear();
  });

  it('should return action schema', async () => {
    const schema = getActionsSchema();
    expect(schema).toBeDefined();
  });

  it('should use cache', () => {
    const spy = jest.spyOn(schemaGenerator, 'generateSchema');

    getActionsSchema();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should include custom schema', () => {
    const schema = getActionsSchema();

    expect(schema['clickSelector']).toBeDefined();
  });
});
