import { getActionsSchema } from '../get-actions-schema';
import { Request, Response } from 'express';
import { getActionSchemaData } from '../../../../../__test_data__';

jest.mock('../../services/get-actions-schema', () => ({
  getActionsSchema: () => getActionSchemaData(),
}));

describe('getActionsSchema', () => {
  it('should send schema', async () => {
    const jsonMock = jest.fn();
    await getActionsSchema(
      {} as Request,
      { json: jsonMock } as Partial<Response>,
    );
    expect(jsonMock).toHaveBeenCalledWith(getActionSchemaData());
  });
});
