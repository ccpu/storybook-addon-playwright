import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import { ActionSetList } from '../ActionSetList';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionSet } from '../../../typings';
import { Snackbar } from '../../common';
import { Button } from '@mui/material';
import fetch from 'jest-fetch-mock';
import { SortableActionSetListItem } from '../ActionSetListItem';
import { useStoryActionSetsLoader } from '../../../hooks/use-story-action-sets-loader';
import { useCurrentStoryActionSets } from '../../../hooks/use-current-story-action-sets';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../hooks/use-current-story-data');
jest.mock('../../../hooks/use-story-action-sets-loader');
jest.mock('../../../hooks/use-current-story-action-sets');

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

mocked(useCurrentStoryActionSets).mockImplementation(
  () => useCurrentStoryActionSetsData,
);

describe('ActionSetList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    (useCurrentStoryActionSets as jest.Mock).mockImplementationOnce(() => ({
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

  it('should delete action set', async () => {
    fetch.mockResponseOnce(JSON.stringify('{success:true}'));

    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);
    list.props().onDelete({ id: 'action-set-id' } as ActionSet);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSetId: 'action-set-id',
        storyId: 'story-id',
        type: 'deleteActionSet',
      },
    ]);
  });

  it('should display error if request failed and close after', async () => {
    fetch.mockRejectOnce(() => Promise.reject(new Error('foo')));

    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);
    list.props().onDelete({ id: 'action-set-id' } as ActionSet);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.find(Snackbar)).toHaveLength(1);

    wrapper.find(Snackbar).props().onClose();

    expect(wrapper.find(Snackbar)).toHaveLength(0);
  });

  it('should handle edit', async () => {
    fetch.mockRejectOnce(() => Promise.reject(new Error('foo')));

    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);
    list.props().onEdit({ id: 'action-set-id' } as ActionSet);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

  it('should toggle story current action sets', () => {
    const wrapper = shallow(<ActionSetList />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(SortableActionSetListItem);

    list.props().onCheckBoxClick({ id: 'action-set-id' } as ActionSet);

    expect(dispatchMock).toHaveBeenCalledWith([
      { actionSetId: 'action-set-id', type: 'toggleCurrentActionSet' },
    ]);
  });

  it('should show action set loader error and retry', () => {
    const retry = jest.fn();
    (useStoryActionSetsLoader as jest.Mock).mockImplementationOnce(() => ({
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
