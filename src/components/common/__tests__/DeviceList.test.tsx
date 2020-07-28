import { DeviceList } from '../DeviceList';
import { shallow } from 'enzyme';
import React from 'react';
import { Menu, Tooltip } from '@material-ui/core';
import { DeviceListItem } from '../DeviceListItem';
import { IconButton } from '@storybook/components';

describe('DeviceList', () => {
  it('should render', () => {
    const wrapper = shallow(<DeviceList />);
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(Tooltip).props().title).toBe('device list');
  });

  it('should open close menu', () => {
    const wrapper = shallow(<DeviceList />);

    expect(wrapper.find(Menu).props().anchorEl).toBe(null);

    wrapper
      .find(IconButton)
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

  it('should have selected', () => {
    const onSelectedMock = jest.fn();

    const wrapper = shallow(
      <DeviceList
        onDeviceSelect={onSelectedMock}
        selectedDevice={{ deviceName: 'iPhone 6' }}
      />,
    );

    expect(
      wrapper.find(DeviceListItem).find({ selected: true }).props().name,
    ).toBe('iPhone 6');

    expect(wrapper.find(Tooltip).props().title).toBe('iPhone 6');
  });
});
