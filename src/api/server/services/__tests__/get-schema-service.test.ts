import '../../../../../__manual_mocks__/ts-to-json';
import { getSchemaService } from '../get-schema-service';
import * as generateSchema from '../generate-schema';

describe('getSchemaService', () => {
  it('should call generateSchema', () => {
    const spy = jest.spyOn(generateSchema, 'generateSchema');
    getSchemaService({ type: 'MyType' });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
