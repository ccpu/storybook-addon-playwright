import React from 'react';
import { LayoutRight } from '../../src/icons/LayoutRight';
import { shallow } from 'enzyme';

describe('LayoutRight', () => {
  it('should render', () => {
    const wrapper = shallow(<LayoutRight />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
