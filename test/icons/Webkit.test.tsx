import React from 'react';
import { Webkit } from '../../src/icons/Webkit';
import { shallow } from 'enzyme';

describe('Webkit', () => {
  it('should render', () => {
    const wrapper = shallow(<Webkit />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
