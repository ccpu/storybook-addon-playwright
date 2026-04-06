import { getActionSchemaData } from '../../../../configs';
import type { ActionSetState } from '../../../../../src/features/action-set/store/action-set-store';

export const useActionSetStoreState = vi.fn();

const mockData = {
  actionSchema: getActionSchemaData(),
} as unknown as ActionSetState;

const useActionSetStoreStateMock = vi.mocked(useActionSetStoreState);
useActionSetStoreStateMock.mockImplementation(() => mockData);
