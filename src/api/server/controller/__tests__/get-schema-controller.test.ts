import '../../../../../__manual_mocks__/ts-to-json';
import { getSchemaController } from '../get-schema-controller';
import * as getSchema from '../../services/get-schema-service';
import { Request, Response } from 'express';

describe('getSchemaController', () => {
  it('should send schema', async () => {
    const jsonMock = jest.fn();
    const spy = jest.spyOn(getSchema, 'getSchemaService');
    await getSchemaController(
      { body: { schemaName: 'MyType' } } as Request,
      ({
        json: jsonMock,
      } as unknown) as Response,
    );
    expect(spy.mock.calls[0][0]).toBe('MyType');
  });
});
