import {
  createParserMock,
  createProgramMock,
} from '../../../../../__manual_mocks__/ts-to-json';
import { generateSchema, cachedSchema } from '../generate-schema';

import { resolve } from 'path';

describe('generateSchema', () => {
  const path = resolve('./src/api/server/services/typings/app-types.ts');

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(cachedSchema).forEach((k) => {
      cachedSchema[k] = undefined;
    });
  });

  it('should use cache ', () => {
    expect(generateSchema({ path, type: 'MyType' })).toStrictEqual({
      props: true,
    });
    expect(createParserMock).toHaveBeenCalledTimes(1);
    expect(generateSchema({ path, type: 'MyType' })).toStrictEqual({
      props: true,
    });
    expect(createParserMock).toHaveBeenCalledTimes(1);
  });

  it('should return properties', () => {
    expect(generateSchema({ path, type: 'MyType' })).toStrictEqual({
      props: true,
    });
  });

  it('should have path', () => {
    generateSchema({ path, type: 'MyType' });
    expect(createProgramMock.mock.calls[0][0].path).toBe(path);
  });

  it('should have default path', () => {
    generateSchema({ type: 'MyType' });
    expect(createProgramMock.mock.calls[0][0].path).toBeDefined();
  });
});
