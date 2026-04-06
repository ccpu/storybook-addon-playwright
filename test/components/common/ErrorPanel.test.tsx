import { ErrorPanel } from '../../../src/components/common/ErrorPanel';
import { shallow } from 'enzyme';
import React from 'react';

describe('ErrorPanel', () => {
  it('should render', () => {
    const wrapper = shallow(<ErrorPanel message="foo" />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
