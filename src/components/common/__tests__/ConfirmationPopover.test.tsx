import { ConfirmationPopover } from '../ConfirmationPopover';
import { shallow } from 'enzyme';
import React from 'react';
import { ActionPopover } from '../ActionPopover';
describe('ConfirmationPopover', () => {
  const onCancelMock = jest.fn();
  const onCloseMock = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(
      <ConfirmationPopover onConfirm={jest.fn()} onClose={onCloseMock} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle close', () => {
    const wrapper = shallow(
      <ConfirmationPopover onConfirm={jest.fn()} onClose={onCloseMock} />,
    );
    wrapper.find(ActionPopover).props().onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should handle cancel', () => {
    const wrapper = shallow(
      <ConfirmationPopover
        onConfirm={jest.fn()}
        onClose={onCloseMock}
        onCancel={onCancelMock}
      />,
    );
    wrapper.find(ActionPopover).props().onClose();
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
