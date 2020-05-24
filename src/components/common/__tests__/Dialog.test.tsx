import { Dialog } from '../Dialog';
import { shallow } from 'enzyme';
import React from 'react';
describe('Dialog', () => {
  it('should render', () => {
    const wrapper = shallow(<Dialog open={true} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
