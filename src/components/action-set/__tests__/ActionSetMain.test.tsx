import { dispatchMock } from '../../../../__test_helper__/manual-mocks/store/action/context';
import { ActionSetMain } from '../ActionSetMain';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionToolbar } from '../../action-set/ActionSetToolbar';
import { InputDialog } from '../../common';

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

  it('should create new action set', () => {
    const wrapper = shallow(<ActionSetMain />);
    const toolbar = wrapper.find(ActionToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onAddActionSet();
    const inputDialog = wrapper.find(InputDialog);
    inputDialog.props().onSave('new action set');

    expect(dispatchMock).toBeCalledTimes(1);
  });

  // it('should create new action set', () => {
  //   const wrapper = shallow(<ActionSetMain />);
  //   const toolbar = wrapper.find(ActionToolbar);

  //   expect(toolbar).toHaveLength(1);

  //   toolbar.props().onAddActionSet();
  //   const inputDialog = wrapper.find(InputDialog);
  //   inputDialog.props().onSave('new action set');

  //   expect(dispatchMock).toBeCalledTimes(1);
  // });

});
