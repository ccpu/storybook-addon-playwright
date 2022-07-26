import React from 'react';
import { FavouriteActions } from '../FavouriteActions';
import { shallow } from 'enzyme';
import { MenuItem, IconButton } from '@material-ui/core';
import { getFavouriteActions } from '../../../api/client/get-favourite-actions';
import { mocked } from 'ts-jest/utils';
import { FavouriteActionSet } from '../../../typings';
import { deleteFavouriteAction } from '../../../api/client/delete-favourite-action';
import { useActionDispatchContext } from '../../../store/actions/ActionContext';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
// import { useCurrentStoryData } from '../../../hooks/use-current-story-data';

jest.mock('../../../api/client/get-favourite-actions');
jest.mock('../../../api/client/delete-favourite-action');
jest.mock('../../../store/actions/ActionContext');
jest.mock('../../../hooks/use-async-api-call');
jest.mock('../../../hooks/use-current-story-data');

const saveActionSetMock = jest.fn();

mocked(useAsyncApiCall).mockImplementation(() => ({
  ErrorSnackbar: jest.fn(),
  clearError: jest.fn(),
  clearResult: jest.fn(),
  error: undefined,
  inProgress: false,
  makeCall: saveActionSetMock,
  result: undefined,
}));

jest.mock('react', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
  useState: (def) => {
    const set = jest.fn();
    return [def, set];
  },
}));

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
  const onCloseMock = jest.fn();
  const anchorEl = document.createElement('div');

  mocked(getFavouriteActions).mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve([actionSet]);
      }),
  );
  mocked(useActionDispatchContext).mockImplementation(() => () => undefined);

  afterEach(() => {
    jest.clearAllMocks();
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
        actions: [{ id: 'Kj6iSI1D3BIF1yX_BLgxF', name: 'takeScreenshot' }],
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
