// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('../../../../../src/api/trpc/client', async () => {
  const { changeActionSetIndex, deleteActionSet } =
    await import('../../../../api/trpc/clients/__mocks__/action-set.client');
  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      actionSet: {
        changeActionSetIndex: {
          useMutation: () => ({
            data: undefined,
            isPending: false,
            mutate: (input: unknown) => {
              void changeActionSetIndex(input as never);
            },
            mutateAsync: (input: unknown) => changeActionSetIndex(input as never),
            reset: vi.fn(),
          }),
        },
        deleteActionSet: {
          useMutation: () => ({
            data: undefined,
            isPending: false,
            mutate: (input: unknown) => {
              void deleteActionSet(input as never);
            },
            mutateAsync: (input: unknown) => deleteActionSet(input as never),
            reset: vi.fn(),
          }),
        },
      },
    },
  };
});
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<object>();
  return {
    ...actual,
    useEffect: (fn: any, deps?: any) => (globalThis as any).__useEffectSpy?.(fn, deps),
  };
});
import {
  sortActionSetsMock,
  cancelEditActionSetMock,
  addActionSetMock,
  clearCurrentActionSetsMock,
  deleteTempActionSetsMock,
} from '../../../../manual-mocks/store/action/context';
import '../../../../manual-mocks/react-useEffect';
import { ActionSetMain } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetMain';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionToolbar } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetToolbar';
import { inputModal } from '../../../../../src/components/common';
import { ActionSetList } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetList';
import { useStorybookState } from '@storybook/manager-api';
import { useCurrentActions } from '../../../../../src/features/action-set/hooks/use-current-actions';

vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () => await import('../../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../../src/features/action-set/hooks/use-current-actions',
  async () => await import('../../hooks/__mocks__/use-current-actions'),
);
vi.mock(
  '../../../../../src/api/trpc/clients/action-set.client',
  async () => await import('../../../../api/trpc/clients/__mocks__/action-set.client'),
);

describe('ActionSetMain', () => {
  const showModalMock = vi.spyOn(inputModal, 'show').mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCurrentActions).mockReturnValue({
      currentActions: [],
      state: {} as any,
    });
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetMain />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show title dialog and close', () => {
    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onAddActionSet();

    expect(showModalMock).toHaveBeenCalledTimes(1);
    expect(showModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        required: true,
        title: 'Action set title',
      }),
    );
  });

  it('should handle sort action list', () => {
    const wrapper = shallow(<ActionSetMain />);
    const actionSetList = wrapper.find(ActionSetList);
    actionSetList.props().onSortEnd?.({ newIndex: 1, oldIndex: 2 });
    expect(sortActionSetsMock).toHaveBeenCalledWith({
      newIndex: 1,
      oldIndex: 2,
      storyId: 'story-id',
    });
  });

  it('should create new action set and cancel', () => {
    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    toolbar.props().onAddActionSet();
    const showArgs = showModalMock.mock.calls[0][0] as {
      onSave: (value: string) => void;
    };
    showArgs.onSave('new action set');

    expect(cancelEditActionSetMock).toHaveBeenCalledWith('story-id');

    expect(addActionSetMock).toHaveBeenCalledWith({
      actionSet: {
        actions: [],
        id: 'id-1',
        title: 'new action set',
      },
      isNew: true,
      selected: true,
      storyId: 'story-id',
    });
  });

  it('should clearCurrentActionSets on story change', () => {
    const wrapper = shallow(<ActionSetMain />);

    (useStorybookState as Mock).mockImplementationOnce(() => ({
      storyId: 'new-story-id',
    }));

    wrapper.setProps({ ['fake']: 'true' });

    // should called on mount an story change
    expect(clearCurrentActionSetsMock).toHaveBeenCalledTimes(2);
  });

  it('should handle reset', () => {
    const wrapper = shallow(<ActionSetMain />);

    const toolbar = wrapper.find(ActionToolbar);

    toolbar.props().onReset();

    expect(clearCurrentActionSetsMock).toHaveBeenCalled();
    expect(deleteTempActionSetsMock).toHaveBeenCalledWith('story-id');
  });
});
