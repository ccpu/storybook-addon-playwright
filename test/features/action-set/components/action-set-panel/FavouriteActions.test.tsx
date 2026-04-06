import React from 'react';
import { FavouriteActions } from '../../../../../src/features/action-set/components/action-set-panel/FavouriteActions';
import { shallow } from 'enzyme';
import { MenuItem, IconButton } from '@material-ui/core';
import {
  getFavouriteActions,
  deleteFavouriteAction,
} from '../../../../../src/api/trpc/clients/favourite-actions.client';
import { FavouriteActionSet } from '../../../../../src/typings';
import { useActionDispatchContext } from '../../../../../src/features/action-set/store/ActionContext';
import { useAsyncApiCall } from '../../../../../src/hooks/use-async-api-call';
// import { useCurrentStoryData } from '../../../../../hooks/use-current-story-data';

vi.mock(
  '../../../../../src/api/trpc/clients/favourite-actions.client',
  async () =>
    await import(
      '../../../../api/trpc/clients/__mocks__/favourite-actions.client'
    ),
);
vi.mock(
  '../../../../../src/features/action-set/store/ActionContext',
  async () => await import('../../store/__mocks__/ActionContext'),
);
vi.mock(
  '../../../../../src/hooks/use-async-api-call',
  async () => await import('../../../../hooks/__mocks__/use-async-api-call'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);

const saveActionSetMock = vi.fn();

vi.mocked(useAsyncApiCall).mockImplementation(() => ({
  ErrorSnackbar: () => null,
  clearError: vi.fn(),
  clearResult: vi.fn(),
  error: undefined,
  inProgress: false,
  makeCall: saveActionSetMock,
  result: undefined,
}));

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

const actionSet: FavouriteActionSet = {
  actions: [
    {
      id: 'action-id',
      name: 'action-name',
    },
  ],
  id: 'action-set-id',
  title: 'action-set-desc',
};

describe('FavouriteActions', () => {
  const onCloseMock = vi.fn();
  const anchorEl = document.createElement('div');

  vi.mocked(getFavouriteActions).mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve([actionSet]);
      }),
  );
  vi.mocked(useActionDispatchContext).mockImplementation(() => () => undefined);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(FavouriteActions).toBeDefined();
  });

  it('should render', () => {
    const wrapper = shallow(<FavouriteActions onClose={onCloseMock} />);

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(MenuItem).length).toBe(0);
  });

  it('should load actions', () => {
    shallow(<FavouriteActions onClose={onCloseMock} anchorEl={anchorEl} />);

    expect(getFavouriteActions).toHaveBeenCalled();
  });

  it('should add quick action', async () => {
    const wrapper = shallow(
      <FavouriteActions onClose={onCloseMock} anchorEl={anchorEl} />,
    );

    await wrapper
      .find(MenuItem)
      .first()
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(useActionDispatchContext).toHaveBeenCalled();
    expect(saveActionSetMock).toHaveBeenCalledWith({
      actionSet: {
        actions: [{ id: 'Kj6iSI1D3BIF1yX', name: 'takeScreenshot' }],
        adaptabilityLevel: undefined,
        id: 'id-1',
        title: 'Take screenshot',
      },
      fileName: './test.stories.tsx',
      storyId: 'story-id',
    });
  });

  it('should delete action', () => {
    const wrapper = shallow(
      <FavouriteActions onClose={onCloseMock} anchorEl={anchorEl} />,
    );

    wrapper
      .find(IconButton)
      .last()
      .props()
      .onClick({ stopPropagation: () => undefined } as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >);

    expect(deleteFavouriteAction).toHaveBeenCalled();
  });
});
