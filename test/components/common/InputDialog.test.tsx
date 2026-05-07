import '../../manual-mocks/react-useEffect';
import { InputDialog } from '../../../src/components/common/InputDialog';
import { shallow } from 'enzyme';
import React from 'react';
import { TextField, Snackbar } from '@material-ui/core';
import { ActionDialog } from '../../../src/components/common/ActionDialog';

describe('InputDialog', () => {
  it('should render', () => {
    const wrapper = shallow(
      <InputDialog onSave={vi.fn()} open={true} onClose={vi.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should  save', () => {
    const saveMock = vi.fn();
    const wrapper = shallow(
      <InputDialog onClose={vi.fn()} open={true} onSave={saveMock} />,
    );

    wrapper
      .find(TextField)
      .props()
      .onChange?.({ target: { value: 'foo' } } as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >);

    wrapper.find(ActionDialog).props().onPositiveAction?.();

    expect(saveMock).toHaveBeenCalledWith('foo');
  });

  it('should validate on save and show/close Snackbar', () => {
    const saveMock = vi.fn();
    const wrapper = shallow(
      <InputDialog onClose={vi.fn()} open={true} onSave={saveMock} required />,
    );

    wrapper
      .find(TextField)
      .props()
      .onChange?.({ target: { value: '' } } as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >);

    wrapper.find(ActionDialog).props().onPositiveAction?.();

    expect(wrapper.find(Snackbar).text()).toBe('Field is required');

    wrapper
      .find(Snackbar)
      .props()
      .onClose?.({} as React.SyntheticEvent<unknown, Event>, 'clickaway');

    expect(wrapper.find(Snackbar).props().open).toBe(false);
  });

  it('should handle close and cancel', () => {
    const closeMock = vi.fn();
    const cancelMock = vi.fn();

    const wrapper = shallow(
      <InputDialog
        onClose={closeMock}
        open={true}
        onSave={vi.fn()}
        onCancel={cancelMock}
      />,
    );
    wrapper.find(ActionDialog).props().onClose();
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it('should have default value', () => {
    const wrapper = shallow(
      <InputDialog onClose={vi.fn()} open={true} onSave={vi.fn()} value={'val'} />,
    );

    expect(wrapper.find(TextField).props().value).toBe('val');
  });
});
