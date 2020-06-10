import React from 'react';
import { Chrome } from '../Chrome';
import { shallow } from 'enzyme';

describe('Chrome', () => {
  it('should render', () => {
    const wrapper = shallow(<Chrome />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
