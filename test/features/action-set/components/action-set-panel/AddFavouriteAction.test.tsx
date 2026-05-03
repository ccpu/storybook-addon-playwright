import { AddFavouriteAction } from '../../../../../src/features/action-set/components/action-set-panel/AddFavouriteAction';
import { shallow } from 'enzyme';
import { FavouriteActionSet } from '../../../../../src/typings';
import React from 'react';

vi.mock('../../../../../src/api/trpc/client', async () => {
  const { addFavouriteAction } = await import(
    '../../../../api/trpc/clients/__mocks__/favourite-actions.client'
  );
  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      favouriteActions: {
        addFavouriteAction: {
          useMutation: () => ({
            data: undefined,
            isPending: false,
            mutate: (input: unknown) => {
              void addFavouriteAction(input as never);
            },
            mutateAsync: (input: unknown) => addFavouriteAction(input as never),
            reset: vi.fn(),
          }),
        },
      },
    },
  };
});
vi.mock(
  '../../../../../src/hooks/use-anchor-el',
  async () => await import('../../../../hooks/__mocks__/use-anchor-el'),
);
vi.mock(
  '../../../../../src/api/trpc/clients/favourite-actions.client',
  async () =>
    await import(
      '../../../../api/trpc/clients/__mocks__/favourite-actions.client'
    ),
);

const actionSet: FavouriteActionSet = {
  actions: [
    {
      id: 'action-id',
      name: 'action-name',
    },
  ],
  id: 'action-set-id',
  title: 'action-set-desc',
  visibleTo: '*',
};

describe('AddFavouriteAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(AddFavouriteAction).toBeDefined();
  });

  it('should render', () => {
    const wrapper = shallow(<AddFavouriteAction item={actionSet} />);

    expect(wrapper.exists()).toBeTruthy();
  });
});
