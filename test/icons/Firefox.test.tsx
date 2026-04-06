import React from 'react';
import { Firefox } from '../../src/icons/Firefox';
import { shallow } from 'enzyme';

describe('Firefox', () => {
  it('should render', () => {
    const wrapper = shallow(<Firefox />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
