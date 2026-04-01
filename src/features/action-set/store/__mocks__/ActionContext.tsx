import { getActionSchemaData } from '../../../../../__test_data__';
import { ReducerState } from '../../../../../__manual_mocks__/store/action/context';

export const useActionContext = vi.fn();
export const useActionDispatchContext = vi.fn();

const mockData = {
  actionSchema: getActionSchemaData(),
} as unknown as ReducerState;

const useActionContextMock = vi.mocked(useActionContext);
useActionContextMock.mockImplementation(() => mockData);
