import { DeviceList } from '../DeviceList';
import { shallow } from 'enzyme';
import React from 'react';
import { Menu, Button } from '@material-ui/core';
import { DeviceListItem } from '../DeviceListItem';

describe('DeviceList', () => {
  it('should render', () => {
    const wrapper = shallow(<DeviceList onDeviceSelect={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should open close menu', () => {
    const wrapper = shallow(<DeviceList onDeviceSelect={jest.fn()} />);

    expect(wrapper.find(Menu).props().anchorEl).toBe(null);

    wrapper
      .find(Button)
      .props()
      .onClick({ currentTarget: {} } as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >);

    expect(wrapper.find(Menu).props().anchorEl).toBeDefined();

    wrapper.find(Menu).props().onClose({}, 'backdropClick');

    expect(wrapper.find(Menu).props().anchorEl).toBe(null);
  });

  it('should handle selection', () => {
    const onSelectedMock = jest.fn();

    const wrapper = shallow(<DeviceList onDeviceSelect={onSelectedMock} />);

    wrapper.find(DeviceListItem).first().props().onClick('foo');

    expect(onSelectedMock).toHaveBeenCalledWith('foo');
  });
});
