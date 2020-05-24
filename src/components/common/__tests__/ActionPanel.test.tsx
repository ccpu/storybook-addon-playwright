import { ActionPanel } from '../ActionPanel';
import { shallow } from 'enzyme';
import React from 'react';
describe('ActionPanel', () => {
  it('should render', () => {
    const wrapper = shallow(<ActionPanel />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
