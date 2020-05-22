import { ScreenshotList } from '../ScreenshotList';
import { shallow } from 'enzyme';
import React from 'react';

describe('ScreenshotList', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotList />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
