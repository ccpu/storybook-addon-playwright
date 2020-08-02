import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import '../../../../__manual_mocks__/react-useEffect';
import '../../../../__manual_mocks__/nanoid';
import { ActionSetMain } from '../ActionSetMain';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionToolbar } from '../ActionSetToolbar';
import { InputDialog } from '../../common';
import { ActionSetList } from '../ActionSetList';
import { SortEnd, SortEvent } from 'react-sortable-hoc';
import { useStorybookState } from '@storybook/api';

jest.mock('../../../hooks/use-current-story-data');

describe('ActionSetMain', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
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
    let inputDialog = wrapper.find(InputDialog);
    expect(inputDialog).toHaveLength(1);
    expect(inputDialog.props().open).toBeTruthy();

    inputDialog.props().onClose();
    inputDialog = wrapper.find(InputDialog);
    expect(inputDialog.props().open).toBeFalsy();
  });

  it('should handle sort action list', () => {
    const wrapper = shallow(<ActionSetMain />);
    const actionSetList = wrapper.find(ActionSetList);
    actionSetList
      .props()
      .onSortEnd({ newIndex: 1, oldIndex: 2 } as SortEnd, {} as SortEvent);
    expect(dispatchMock).toHaveBeenCalledWith([
      { newIndex: 1, oldIndex: 2, storyId: 'story-id', type: 'sortActionSets' },
    ]);
  });

  it('should create new action set and cancel', () => {
    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    toolbar.props().onAddActionSet();
    const inputDialog = wrapper.find(InputDialog);
    inputDialog.props().onSave('new action set');

    expect(dispatchMock).toHaveBeenCalledWith([
      { storyId: 'story-id', type: 'cancelEditActionSet' },
    ]);

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSet: {
          actions: [],
          id: 'action-id',
          title: 'new action set',
        },
        new: true,
        selected: true,
        storyId: 'story-id',
        type: 'addActionSet',
      },
    ]);
  });

  it('should clearCurrentActionSets on story change', () => {
    const wrapper = shallow(<ActionSetMain />);

    (useStorybookState as jest.Mock).mockImplementationOnce(() => ({
      storyId: 'new-story-id',
    }));

    wrapper.setProps({ ['fake']: 'true' });

    // should called on mount an story change
    expect(dispatchMock).toHaveBeenCalledTimes(2);
  });
});
