import { ScreenshotOptionsPopover } from '../ScreenshotOptionsPopover';
import { shallow } from 'enzyme';
import React from 'react';

import { Popover } from '@material-ui/core';
import { IconButton } from '@storybook/components';

describe('ScreenshotOptionsPopover', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotOptionsPopover onChange={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show/hide settings', () => {
    const wrapper = shallow(<ScreenshotOptionsPopover onChange={jest.fn()} />);
    wrapper
      .find(IconButton)
      .props()
      .onClick({ target: {} } as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >);
    expect(wrapper.find(Popover).props().anchorEl).toBeDefined();
    wrapper.find(Popover).props().onClose({}, 'backdropClick');
    expect(wrapper.find(Popover).props().anchorEl).not.toBeDefined();
  });
});
