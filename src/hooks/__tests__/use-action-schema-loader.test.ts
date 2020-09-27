import { useActionSchemaLoader } from '../use-action-schema-loader';
import { renderHook } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { getActionSchemaData } from '../../../__test_data__';
import * as context from '../../store/actions/ActionContext';

describe('useActionSchemaLoader', () => {
  it('should test useActionSchemaLoader', async () => {
    fetch.mockResponseOnce(JSON.stringify(getActionSchemaData()));
    const { waitForNextUpdate, result } = renderHook(
      () => useActionSchemaLoader(),
      {
        wrapper: context.ActionProvider,
      },
    );

    await waitForNextUpdate();

    expect(result.current.loaded).toBe(true);
  });
});
