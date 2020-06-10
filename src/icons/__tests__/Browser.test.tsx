import React from 'react';
import { Browser } from '../Browser';
import { shallow } from 'enzyme';

describe('Browser', () => {
  it('should render', () => {
    const wrapper = shallow(<Browser />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
