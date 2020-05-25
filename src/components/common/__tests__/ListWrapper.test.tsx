import { ListWrapper } from '../ListWrapper';
import { shallow } from 'enzyme';
import React from 'react';

describe('ListWrapper', () => {
  it('should render', () => {
    const wrapper = shallow(<ListWrapper />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
