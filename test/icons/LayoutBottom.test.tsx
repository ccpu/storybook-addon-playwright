import React from 'react';
import { LayoutBottom } from '../../src/icons/LayoutBottom';
import { shallow } from 'enzyme';

describe('LayoutBottom', () => {
  it('should render', () => {
    const wrapper = shallow(<LayoutBottom />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
