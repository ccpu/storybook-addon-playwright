import '../../manual-mocks/react-useEffect';
import { InputDialog } from '../../../src/components/common/InputDialog';
import { shallow } from 'enzyme';
import React from 'react';
import { Button, TextField } from '@mui/material';
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

  it('should validate on save and show error state', () => {
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

    expect(wrapper.find(TextField).prop('error')).toBe(true);
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

  it('should show generate button when generator is available', () => {
    const wrapper = shallow(
      <InputDialog
        onClose={vi.fn()}
        open={true}
        onSave={vi.fn()}
        onGenerateContent={vi.fn()}
      />,
    );

    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
