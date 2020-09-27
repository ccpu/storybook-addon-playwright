import { ScreenshotPanel } from '../ScreenshotPanel';
import { ScreenshotMain } from '../../screenshot-panel/ScreenshotMain';
import { shallow } from 'enzyme';
import React from 'react';
import { useStorybookState } from '@storybook/api';
import { SCREENSHOT_PANEL_ID } from '../../../constants';

describe('ScreenshotPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    (useStorybookState as jest.Mock).mockImplementation(() => ({
      selectedPanel: SCREENSHOT_PANEL_ID,
    }));
    const wrapper = shallow(<ScreenshotPanel />);

    expect(wrapper.find(ScreenshotMain)).toHaveLength(1);
  });
});
