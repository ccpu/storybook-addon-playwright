import React from 'react';
import { Firefox } from '../Firefox';
import { shallow } from 'enzyme';

describe('Firefox', () => {
  it('should render', () => {
    const wrapper = shallow(<Firefox />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
