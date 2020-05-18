import { dispatchMock } from '../../../../__manual_mocks__/store/action/context';
import '../../../../__manual_mocks__/nanoid';
import '../../../../__manual_mocks__/hooks/use-current-story-data';
import { ActionSetMain } from '../ActionSetMain';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionToolbar } from '../../action-set/ActionSetToolbar';
import { InputDialog, Snackbar } from '../../common';
import { ActionSetEditor } from '../ActionSetEditor';
import fetch from 'jest-fetch-mock';
import { ActionSetList } from '../ActionSetList';
import { SortEnd, SortEvent } from 'react-sortable-hoc';

describe('ActionSetMain', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionSetMain />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show description dialog and close', () => {
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

  it('should edit action set', () => {
    const wrapper = shallow(<ActionSetMain />);
    const actionSetList = wrapper.find(ActionSetList);

    expect(actionSetList).toHaveLength(1);
    actionSetList.props().onEdit({
      actions: [],
      description: 'action-set-desc',
      id: 'action-set-id',
    });
    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSet: {
          actions: [],
          description: 'action-set-desc',
          id: 'action-set-id',
        },
        type: 'setEditorActionSet',
      },
    ]);
  });

  it('should create new action set and cancel', () => {
    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    toolbar.props().onAddActionSet();
    const inputDialog = wrapper.find(InputDialog);
    inputDialog.props().onSave('new action set');

    const actionSetEditor = wrapper.find(ActionSetEditor);

    expect(dispatchMock).toBeCalledTimes(1);
    expect(actionSetEditor).toHaveLength(1);

    actionSetEditor.props().onClose();

    expect(wrapper.find(ActionSetEditor)).toHaveLength(0);

    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'clearEditorActionSet' },
    ]);
  });

  it('should create new action set and save', async () => {
    fetch.mockResponseOnce(JSON.stringify('{success:true}'));

    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    toolbar.props().onAddActionSet();
    const inputDialog = wrapper.find(InputDialog);
    inputDialog.props().onSave('new action set');

    const actionSetEditor = wrapper.find(ActionSetEditor);

    actionSetEditor.props().onSaved({
      actions: [{ id: 'action-id', name: 'action-name' }],
      description: 'action-set-desc',
      id: 'action-set-id',
    });

    await new Promise((resolve) => setTimeout(resolve, 40));

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        actionSet: {
          actions: [],
          description: 'new action set',
          id: 'action-id',
        },
        type: 'setEditorActionSet',
      },
    ]);
  });

  it('should show error if it cannot save new action set and close', async () => {
    fetch.mockRejectOnce(new Error('foo'));

    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    toolbar.props().onAddActionSet();
    const inputDialog = wrapper.find(InputDialog);
    inputDialog.props().onSave('new action set');

    const actionSetEditor = wrapper.find(ActionSetEditor);

    actionSetEditor.props().onSaved({
      actions: [{ id: 'action-id', name: 'action-name' }],
      description: 'action-set-desc',
      id: 'action-set-id',
    });

    expect(wrapper.find(Snackbar)).toHaveLength(0);

    await new Promise((resolve) => setTimeout(resolve, 40));

    expect(wrapper.find(Snackbar)).toHaveLength(1);

    wrapper.find(Snackbar).props().onClose();

    expect(wrapper.find(Snackbar)).toHaveLength(0);
  });
});
