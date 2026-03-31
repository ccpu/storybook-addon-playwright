import { OptionPopover } from '../OptionPopover';
import { shallow } from 'enzyme';
import React from 'react';
import Icon from '@material-ui/icons/AcUnit';
import { IconButton, Popover } from '@material-ui/core';
import { IconButton as SIconButton } from '@storybook/components';

describe('OptionPopover', () => {
  it('should render', () => {
    const wrapper = shallow(<OptionPopover title="title" Icon={Icon} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should set anchor', () => {
    const wrapper = shallow(<OptionPopover title="title" Icon={Icon} />);
    wrapper
      .find(SIconButton)
      .props()
      .onClick({ target: {} } as never);
    expect(wrapper.find(Popover).props().anchorEl).toBeDefined();
  });

  it('should handle close', () => {
    const wrapper = shallow(<OptionPopover title="title" Icon={Icon} />);
    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    expect(wrapper.find(Popover).props().anchorEl).not.toBeDefined();
  });
});
