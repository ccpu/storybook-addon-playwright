import { Toolbar } from '../Toolbar';
import { shallow } from 'enzyme';
import React from 'react';
describe('Toolbar', () => {
  it('should render', () => {
    const wrapper = shallow(<Toolbar />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have border', () => {
    const wrapper = shallow(<Toolbar border={['top']} />);
    expect(wrapper.find('div').first().hasClass('border-top')).toBeTruthy();
  });
});
