import {
  editActionSetMock,
  toggleCurrentActionSetMock,
} from '../../../../manual-mocks/store/action/context';
import { ActionSetList } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetList';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionSet } from '../../../../../src/typings';
import { Snackbar } from '../../../../../src/components/common';
import { Button } from '@material-ui/core';
import { SortableActionSetListItem } from '../../../../../src/features/action-set/components/action-set-panel/ActionSetListItem';
import { useStoryActionSetsLoader } from '../../../../../src/features/action-set/hooks/use-story-action-sets-loader';
import { useCurrentStoryActionSets } from '../../../../../src/features/action-set/hooks/use-current-story-action-sets';

vi.mock('../../../../../src/api/trpc/client', async () => {
  const { deleteActionSet, saveActionSet } = await import(
    '../../../../api/trpc/clients/__mocks__/action-set.client'
  );

  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      actionSet: {
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
        saveActionSet: {
          useMutation: () => ({
            data: undefined,
            isPending: false,
            mutate: (input: unknown) => {
              void saveActionSet(input as never);
            },
            mutateAsync: (input: unknown) => saveActionSet(input as never),
            reset: vi.fn(),
          }),
        },
      },
    },
  };
});
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../../src/features/action-set/hooks/use-story-action-sets-loader',
  async () =>
    await import('../../hooks/__mocks__/use-story-action-sets-loader'),
);
vi.mock(
  '../../../../../src/features/action-set/hooks/use-current-story-action-sets',
  async () =>
    await import('../../hooks/__mocks__/use-current-story-action-sets'),
);
vi.mock(
  '../../../../../src/api/trpc/clients/action-set.client',
  async () =>
    await import('../../../../api/trpc/clients/__mocks__/action-set.client'),
);

const useCurrentStoryActionSetsData = {
  currentActionSets: ['action-set-id'],
  state: {},
  storyActionSets: [
    {
      actions: [{ id: 'action-id', name: 'action-name' }],
      id: 'action-set-id',
    },
  ] as ActionSet[],
} as ReturnType<typeof useCurrentStoryActionSets>;

vi.mocked(useCurrentStoryActionSets).mockImplementation(
  () => useCurrentStoryActionSetsData,
);

describe('ActionSetList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show no data message', () => {
    (useCurrentStoryActionSets as Mock).mockImplementationOnce(() => ({
      ...useCurrentStoryActionSetsData,
      currentActionSets: [],
      storyActionSets: [] as ActionSet[],
    }));

    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    expect(wrapper.find('.no-data').text()).toBe(
      `No action set to display!Click the '+' button to create an action set.`,
    );
  });

  it('should show list of action sets', () => {
    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);

    expect(list.type()).toBe(SortableActionSetListItem);
  });

  it('should handle edit', async () => {
    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);
    list.props().onEdit({ id: 'action-set-id' } as ActionSet);

    expect(editActionSetMock).toHaveBeenCalledTimes(1);
  });

  it('should toggle story current action sets', () => {
    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);

    list.props().onCheckBoxClick({ id: 'action-set-id' } as ActionSet);

    expect(toggleCurrentActionSetMock).toHaveBeenCalledWith('action-set-id');
  });

  it('should show action set loader error and retry', () => {
    const retry = vi.fn();
    (useStoryActionSetsLoader as Mock).mockImplementationOnce(() => ({
      error: 'foo',
      loading: false,
      retry,
    }));

    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    expect(wrapper.find(Snackbar)).toHaveLength(1);

    wrapper
      .find(Button)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(retry).toHaveBeenCalledTimes(1);
  });
});
