import React from 'react';
import { LayoutBottomRight } from '../LayoutBottomRight';
import { shallow } from 'enzyme';

describe('LayoutBottomRight', () => {
  it('should render', () => {
    const wrapper = shallow(<LayoutBottomRight />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
