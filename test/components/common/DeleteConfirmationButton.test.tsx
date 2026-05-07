import { DeleteConfirmationButton } from '../../../src/components/common/DeleteConfirmationButton';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { ConfirmationPopover } from '../../../src/components/common/ConfirmationPopover';

describe('DeleteConfirmationButton', () => {
  it('should render', () => {
    const wrapper = shallow(<DeleteConfirmationButton onDelete={vi.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle delete', () => {
    const onDeleteMock = vi.fn();
    const wrapper = shallow(<DeleteConfirmationButton onDelete={onDeleteMock} />);
    wrapper.find(IconButton).props().onClick!({
      currentTarget: {},
      stopPropagation: () => true,
    } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    wrapper.update();
    wrapper.find(ConfirmationPopover).props().onConfirm();
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
