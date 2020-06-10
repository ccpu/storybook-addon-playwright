import React from 'react';
import { TestIcon } from '../TestIcon';
import { shallow } from 'enzyme';

describe('TestIcon', () => {
  it('should render', () => {
    const wrapper = shallow(<TestIcon />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
