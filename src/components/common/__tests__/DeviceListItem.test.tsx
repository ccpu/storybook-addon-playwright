import { DeviceListItem } from '../DeviceListItem';
import { shallow } from 'enzyme';
import React from 'react';
import { MenuItem } from '@material-ui/core';

describe('DeviceListItem', () => {
  const onClickMock = jest.fn();
  afterEach(() => {
    onClickMock.mockClear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <DeviceListItem
        name="foo"
        value="bar"
        onClick={onClickMock}
        selected={false}
        viewportSize={{ height: 200, width: 200 }}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle click', () => {
    const wrapper = shallow(
      <DeviceListItem
        name="foo"
        value="bar"
        onClick={onClickMock}
        selected={false}
        viewportSize={{ height: 200, width: 200 }}
      />,
    );
    wrapper
      .find(MenuItem)
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);
    expect(onClickMock).toHaveBeenCalledWith('bar');
  });
});
