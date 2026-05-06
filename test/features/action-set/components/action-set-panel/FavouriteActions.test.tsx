import { addActionSetMock } from '../../../../manual-mocks/store/action/context';
import React from 'react';
import { FavouriteActions } from '../../../../../src/features/action-set/components/action-set-panel/FavouriteActions';
import { shallow } from 'enzyme';
import { ListItem, WithTooltip } from '@storybook/components';

// import { useCurrentStoryData } from '../../../../../hooks/use-current-story-data';

vi.mock('../../../../../src/api/trpc/client', async () => {
  const { getFavouriteActions, deleteFavouriteAction } = await import(
    '../../../../api/trpc/clients/__mocks__/favourite-actions.client'
  );
  const { saveActionSet } = await import(
    '../../../../api/trpc/clients/__mocks__/action-set.client'
  );

  return {
    createTrpcHttpClient: () => ({}),
    trpcClient: {
      Provider: ({ children }: { children: unknown }) => children,
      actionSet: {
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
      favouriteActions: {
        deleteFavouriteAction: {
          useMutation: () => ({
            data: undefined,
            isPending: false,
            mutate: (input: unknown) => {
              void deleteFavouriteAction(input as never);
            },
            mutateAsync: (input: unknown) =>
              deleteFavouriteAction(input as never),
            reset: vi.fn(),
          }),
        },
        getFavouriteActions: {
          useQuery: () => ({
            data: undefined,
            error: undefined,
            isLoading: false,
            isPending: false,
            refetch: async () => ({ data: await getFavouriteActions() }),
          }),
        },
      },
    },
  };
});
vi.mock(
  '../../../../../src/api/trpc/clients/favourite-actions.client',
  async () =>
    await import(
      '../../../../api/trpc/clients/__mocks__/favourite-actions.client'
    ),
);
vi.mock(
  '../../../../../src/api/trpc/clients/action-set.client',
  async () =>
    await import('../../../../api/trpc/clients/__mocks__/action-set.client'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);

// Changed to async factory using vi.importActual because jest.requireActual
// does not exist in vitest (no sync equivalent; vi.importActual is async-only).
// Changed: patch both named exports AND the `default` React object so that
// components accessing React.useEffect / React.useState via the default import
// also get the mocked versions (vitest ESM interop issue).
vi.mock('react', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const actual = await importOriginal<any>();
  const patchedDefault = {
    ...(actual.default ?? actual),
    useCallback: (f) => f,
    useEffect: (f) => f(),
    useState: (def) => [def, vi.fn()],
  };
  return {
    ...actual,
    default: patchedDefault,
    useCallback: (f) => f,
    useEffect: (f) => f(),
    useState: (def) => [def, vi.fn()],
  };
});

describe('FavouriteActions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(FavouriteActions).toBeDefined();
  });

  it('should render', () => {
    const wrapper = shallow(
      <FavouriteActions>
        <button type="button">Open</button>
      </FavouriteActions>,
    );

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(WithTooltip).length).toBe(1);
  });

  it('should add quick action', async () => {
    const wrapper = shallow(
      <FavouriteActions>
        <button type="button">Open</button>
      </FavouriteActions>,
    );

    const tooltipProp = wrapper.find(WithTooltip).props().tooltip as (args: {
      onHide: () => void;
    }) => React.ReactNode;

    const tooltipWrapper = shallow(
      <div>{tooltipProp({ onHide: vi.fn() })}</div>,
    );

    const firstItem = tooltipWrapper.find(ListItem).first();

    await firstItem.props().onClick?.({} as never);

    expect(addActionSetMock).toHaveBeenCalled();
  });
});
