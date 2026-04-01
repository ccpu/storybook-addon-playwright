import { ScreenshotPanel } from '../ScreenshotPanel';
import { ScreenshotMain } from '../../../features/screenshot/components/screenshot-panel/ScreenshotMain';
import { shallow } from 'enzyme';
import React from 'react';
import { useStorybookState } from '@storybook/manager-api';
import { SCREENSHOT_PANEL_ID } from '../../../constants';

describe('ScreenshotPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    (useStorybookState as Mock).mockImplementation(() => ({
      selectedPanel: SCREENSHOT_PANEL_ID,
    }));
    const wrapper = shallow(<ScreenshotPanel />);

    expect(wrapper.find(ScreenshotMain)).toHaveLength(1);
  });
});
