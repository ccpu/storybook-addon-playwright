import { getActionSchema } from '../get-action-schema';
import fetch from 'jest-fetch-mock';
import { getActionSchemaData } from '../../../../__test_helper__/action-schema';

describe('getActionSchema', () => {
  beforeEach(() => {
    fetch.doMock();
  });

  it('should have response', async () => {
    fetch.mockResponseOnce(JSON.stringify(getActionSchemaData()));
    const res = await getActionSchema();
    expect(res).toStrictEqual(getActionSchemaData());
  });

  it('should throw error', async () => {
    fetch.mockReject(new Error('foo'));
    await expect(getActionSchema()).rejects.toThrowError('foo');
  });
});
