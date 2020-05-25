import { InputDialog } from '../InputDialog';
import { shallow } from 'enzyme';
import React from 'react';
import { TextField, Snackbar } from '@material-ui/core';
import { ActionDialog } from '../ActionDialog';

describe('InputDialog', () => {
  it('should render', () => {
    const wrapper = shallow(
      <InputDialog onSave={jest.fn()} open={true} onClose={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should  save', () => {
    const saveMock = jest.fn();
    const wrapper = shallow(
      <InputDialog onClose={jest.fn()} open={true} onSave={saveMock} />,
    );

    wrapper
      .find(TextField)
      .props()
      .onChange({ target: { value: 'foo' } } as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >);

    wrapper.find(ActionDialog).props().onPositiveAction();

    expect(saveMock).toHaveBeenCalledWith('foo');
  });

  it('should validate on save and show/close Snackbar', () => {
    const saveMock = jest.fn();
    const wrapper = shallow(
      <InputDialog
        onClose={jest.fn()}
        open={true}
        onSave={saveMock}
        required
      />,
    );

    wrapper
      .find(TextField)
      .props()
      .onChange({ target: { value: '' } } as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >);

    wrapper.find(ActionDialog).props().onPositiveAction();

    expect(wrapper.find(Snackbar).text()).toBe('Field is required');

    wrapper
      .find(Snackbar)
      .props()
      .onClose({} as React.SyntheticEvent<{}, Event>, 'clickaway');

    expect(wrapper.find(Snackbar).props().open).toBe(false);
  });

  it('should handle close and cancel', () => {
    const closeMock = jest.fn();
    const cancelMock = jest.fn();

    const wrapper = shallow(
      <InputDialog
        onClose={closeMock}
        open={true}
        onSave={jest.fn()}
        onCancel={cancelMock}
      />,
    );
    wrapper.find(ActionDialog).props().onClose();
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledTimes(1);
  });
});
