import { DeleteConfirmationButton } from '../DeleteConfirmationButton';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@mui/material';
import { ConfirmationPopover } from '../ConfirmationPopover';

describe('DeleteConfirmationButton', () => {
  it('should render', () => {
    const wrapper = shallow(<DeleteConfirmationButton onDelete={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle delete', () => {
    const onDeleteMock = jest.fn();
    const wrapper = shallow(
      <DeleteConfirmationButton onDelete={onDeleteMock} />,
    );
    wrapper
      .find(IconButton)
      .props()
      .onClick({
        currentTarget: {},
        stopPropagation: () => true,
      } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    wrapper.find(ConfirmationPopover).props().onConfirm();
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
