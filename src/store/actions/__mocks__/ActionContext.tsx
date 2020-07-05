import { getActionSchemaData } from '../../../../__test_data__';
import { mocked } from 'ts-jest/utils';
import { ReducerState } from '../../../../__manual_mocks__/store/action/context';

export const useActionContext = jest.fn();
export const useActionDispatchContext = jest.fn();

const mockData = ({
  actionSchema: getActionSchemaData(),
} as unknown) as ReducerState;

const useActionContextMock = mocked(useActionContext);
useActionContextMock.mockImplementation(() => mockData);
