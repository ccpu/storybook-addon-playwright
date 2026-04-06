import React from 'react';
import { Chrome } from '../../src/icons/Chrome';
import { shallow } from 'enzyme';

describe('Chrome', () => {
  it('should render', () => {
    const wrapper = shallow(<Chrome />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
