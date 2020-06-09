import { ScreenshotPanel } from '../ScreenshotPanel';
import { ScreenshotPanel as ScreenshotPanelComponent } from '../../screenshot-panel';
import { shallow } from 'enzyme';
import React from 'react';
import { useStorybookState } from '@storybook/api';
import { SCREENSHOT_PANEL_ID } from '../../../constants';

describe('ScreenshotPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should not render panel', () => {
    const wrapper = shallow(<ScreenshotPanel />);
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find(ScreenshotPanelComponent)).toHaveLength(0);
  });
  it('should render ScreenshotPanelComponent  if screenshot panel is current panel', () => {
    (useStorybookState as jest.Mock).mockImplementation(() => ({
      selectedPanel: SCREENSHOT_PANEL_ID,
    }));
    const wrapper = shallow(<ScreenshotPanel />);
    expect(wrapper.find(ScreenshotPanelComponent)).toHaveLength(1);
  });
});
