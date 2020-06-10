import { Toolbar } from '../Toolbar';
import { shallow } from 'enzyme';
import React from 'react';

describe('Toolbar', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Toolbar
        activeBrowsers={['chromium']}
        browserTypes={['chromium']}
        onCLose={jest.fn()}
        onRefresh={jest.fn()}
        toggleBrowser={jest.fn()}
        onSave={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
