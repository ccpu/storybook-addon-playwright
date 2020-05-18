import '../../../../__manual_mocks__/hooks/use-current-story-data';
import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import { useCurrentStoryActionSetsMock } from '../../../../__manual_mocks__/hooks/use-current-story-action-sets';
import {
  useStoryActionSetsLoaderMock,
  useStoryActionSetsLoaderRetryMock,
} from '../../../../__manual_mocks__/hooks/use-story-action-sets-loader';
import { ActionSetList } from '../ActionSetList';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionSet } from '../../../typings';
import { Snackbar, ListItem } from '../../common';
import { Button } from '@material-ui/core';
import fetch from 'jest-fetch-mock';

describe('ActionSetList', () => {
  const onEditMock = jest.fn();

  beforeEach(() => {
    onEditMock.mockClear();
    dispatchMock.mockClear();
    useCurrentStoryActionSetsMock.mockClear();
    useStoryActionSetsLoaderMock.mockClear();
    useStoryActionSetsLoaderRetryMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show no data message', () => {
    useCurrentStoryActionSetsMock.mockImplementationOnce(() => ({
      currentActionSets: ['action-set-id'],
      storyActionSets: [] as ActionSet[],
    }));
    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    expect(wrapper.text()).toBe(
      `No action set to display!Creat action set by click on the '+' button.`,
    );
  });

  it('should show list of action sets ', () => {
    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(ListItem);

    expect(list.type()).toBe(ListItem);
  });

  it('should delete action set ', async () => {
    fetch.mockResponseOnce(JSON.stringify('{success:true}'));

    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(ListItem);
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

    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(ListItem);
    list.props().onDelete({ id: 'action-set-id' } as ActionSet);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.find(Snackbar)).toHaveLength(1);

    wrapper.find(Snackbar).props().onClose();

    expect(wrapper.find(Snackbar)).toHaveLength(0);
  });

  it('should handle edit', async () => {
    fetch.mockRejectOnce(() => Promise.reject(new Error('foo')));

    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(ListItem);
    list.props().onEdit({ id: 'action-set-id' } as ActionSet);

    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it('should toggle story current action sets ', () => {
    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
      disableLifecycleMethods: true,
    })
      .first()
      .shallow();

    const list = wrapper.find(ListItem);

    list.props().onCheckBoxClick({ id: 'action-set-id' } as ActionSet);

    expect(dispatchMock).toHaveBeenCalledWith([
      { actionSetId: 'action-set-id', type: 'toggleCurrentActionSet' },
    ]);
  });

  it('should show action set loader error and retry', () => {
    const retry = jest.fn();
    useStoryActionSetsLoaderMock.mockImplementationOnce(() => ({
      error: 'foo',
      loading: false,
      retry,
    }));

    const wrapper = shallow(<ActionSetList onEdit={onEditMock} />, {
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
