import React from 'react';
import { ActionMenuItem } from '../ActionMenuItem';
import { shallow } from 'enzyme';
import { MenuItem } from '@mui/material';
describe('ActionMenuItem', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ActionMenuItem label="click" name="click" onChange={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle change', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(
      <ActionMenuItem label="click" name="click" onChange={changeMock} />,
    );
    const item = wrapper.find(MenuItem);
    item.props().onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);
    expect(changeMock).toHaveBeenCalledTimes(1);
  });
});
