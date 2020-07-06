import { ScreenshotListItemWrapper } from '../ScreenshotListItemWrapper';
import { shallow } from 'enzyme';
import React from 'react';
describe('ScreenshotListItemWrapper', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListItemWrapper title="title" tooltip="tooltip" />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
