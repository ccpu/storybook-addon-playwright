/* eslint-disable @typescript-eslint/no-unused-vars */
import { getActionsSchema, _schema } from '../get-actions-schema';
import * as schemaGenerator from '../get-actions-schema';
import path from 'path';
import { getConfigs } from '../../configs';

jest.mock('../../configs');

describe('getActionsSchema', () => {
  const file = path.resolve(
    './src/api/server/services/typings/playwright-page.ts',
  );

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should add page method from config', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _schema = undefined;
    (getConfigs as jest.Mock).mockImplementationOnce(() => ({
      pageMethods: ['isClosed'],
    }));

    const schema = getActionsSchema(file);

    expect(schema['isClosed']).toBeDefined();
  });
});
