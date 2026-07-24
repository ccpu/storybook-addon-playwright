import { OptionPopover } from '../../../../../src/features/screenshot/components/screenshot-preview/OptionPopover';
import { shallow } from 'enzyme';
import React from 'react';
import Icon from '@mui/icons-material/AcUnit';
import { Popover } from '../../../../../src/components/common';
import { IconButton as SIconButton } from '@storybook/components';

describe('OptionPopover', () => {
  it('should render', () => {
    const wrapper = shallow(<OptionPopover title="title" Icon={Icon} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should set anchor', () => {
    const wrapper = shallow(<OptionPopover title="title" Icon={Icon} />);
    // The trigger button is the second IconButton (the first is the close
    // button rendered inside the Popover).
    wrapper
      .find(SIconButton)
      .at(1)
      .props()
      .onClick?.({ target: {} } as never);
    expect(wrapper.find(Popover).props().anchorEl).toBeDefined();
  });

  it('should handle close', () => {
    const wrapper = shallow(<OptionPopover title="title" Icon={Icon} />);
    // The close button is the first IconButton (rendered inside the Popover).
    wrapper
      .find(SIconButton)
      .at(0)
      .props()
      .onClick?.({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    expect(wrapper.find(Popover).props().anchorEl).not.toBeDefined();
  });
});
