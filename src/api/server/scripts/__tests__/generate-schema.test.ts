import { createProgramMock } from '../../../../../__manual_mocks__/ts-to-json';
import { generateSchema } from '../generate-schema';

import { resolve } from 'path';

describe('generateSchema', () => {
  const path = resolve('./src/api/server/services/typings/app-types.ts');

  it('should return properties', () => {
    expect(generateSchema({ path, type: 'MyType' })).toStrictEqual({
      props: true,
    });
  });

  it('should have path', () => {
    generateSchema({ path, type: 'MyType' });
    expect(createProgramMock.mock.calls[0][0].path).toBe(path);
  });
});
