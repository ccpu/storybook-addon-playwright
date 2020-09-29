/* eslint-disable @typescript-eslint/no-unused-vars */
import { getActionsSchema } from '../get-actions-schema';
import path from 'path';
import { getConfigs } from '../../configs';
import * as generateSchema from '../generate-schema';

jest.mock('../../configs');

describe('getActionsSchema', () => {
  const file = path.resolve('./src/api/server/services/typings/app-types.ts');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate schema', () => {
    const schema = getActionsSchema(file);

    const filteredSchema = Object.keys(schema).reduce((obj, key) => {
      obj[key] = schema[key];
      delete obj[key].description;
      return obj;
    }, {});

    expect(filteredSchema).toMatchSnapshot();
  });

  it('should return action schema', async () => {
    const schema = getActionsSchema(file);
    expect(schema).toBeDefined();
  });

  it('should include custom schema', () => {
    const schema = getActionsSchema(file);

    expect(schema['clickSelector']).toBeDefined();
  });

  it('should add page method from config', () => {
    const spy = jest.spyOn(generateSchema, 'generateSchema');

    (getConfigs as jest.Mock).mockImplementationOnce(() => ({
      pageMethods: ['isClosed'],
    }));

    getActionsSchema(file);

    expect(
      spy.mock.calls[0][0].includeProps.indexOf('isClosed') > -1,
    ).toBeTruthy();
  });
});
