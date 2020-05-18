import { getActionsSchema } from '../get-actions-schema';
import * as schemaGenerator from '../get-actions-schema';
import path from 'path';
import { spyOnGetConfig } from '../mocks/configs';

describe('getActionsSchema', () => {
  const file = path.resolve(
    './src/api/server/services/typings/playwright-page.ts',
  );

  beforeEach(() => {
    spyOnGetConfig.mockClear();
  });

  it('should return action schema', async () => {
    const schema = getActionsSchema(file);
    expect(schema).toBeDefined();
  });

  it('should use cache', () => {
    const spy = jest.spyOn(schemaGenerator, 'generateSchema');

    getActionsSchema(file);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should include custom schema', () => {
    const schema = getActionsSchema(file);

    expect(schema['clickSelector']).toBeDefined();
  });
});
