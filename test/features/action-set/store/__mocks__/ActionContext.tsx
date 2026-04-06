import { getActionSchemaData } from '../../../../configs';
import type { ReducerState } from '../../../../../src/features/action-set/store/reducer';

export const useActionContext = vi.fn();
export const useActionDispatchContext = vi.fn();

const mockData = {
  actionSchema: getActionSchemaData(),
} as unknown as ReducerState;

const useActionContextMock = vi.mocked(useActionContext);
useActionContextMock.mockImplementation(() => mockData);
