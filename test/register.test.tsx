import React from 'react';
import { shallow } from 'enzyme';

// Mock the hooks
vi.mock('../src/hooks/use-addon-state', () => ({
  useAddonState: vi.fn(() => ({
    addonState: {},
    setAddonState: vi.fn(),
  })),
}));

vi.mock('../src/hooks/use-current-story-data', () => ({
  useCurrentStoryData: vi.fn(() => ({})),
}));

vi.mock('../src/hooks/use-reset-setting', () => ({
  useResetSetting: vi.fn(() => vi.fn()),
}));

import { addons } from '@storybook/manager-api';
import {
  ACTIONS_PANEL_ID,
  PREVIEW_ID,
  SCREENSHOT_PANEL_ID,
  TOOL_ID,
  TOAST_ID,
} from '../src/constants';
import '../src/register';

describe('register', () => {
  it('should add', () => {
    const data = addons.add as Mock;
    expect(data).toHaveBeenCalledTimes(5);

    const getRenderById = (id: string) =>
      data.mock.calls.find((call) => call[0] === id)?.[1].render;

    const ToolComponent = getRenderById(TOOL_ID);
    const tool = shallow(<ToolComponent />);
    expect(tool.exists()).toBe(true);

    const ActionPanel = getRenderById(ACTIONS_PANEL_ID);
    const actionPanelWrapper = shallow(<ActionPanel />);
    expect(actionPanelWrapper.exists()).toBe(true);

    const ScreenshotPanel = getRenderById(SCREENSHOT_PANEL_ID);
    const screenshotPanelWrapper = shallow(<ScreenshotPanel />);
    expect(screenshotPanelWrapper.exists()).toBe(true);

    const Preview = getRenderById(PREVIEW_ID);
    const previewWrapper = shallow(<Preview />);
    expect(previewWrapper.exists()).toBeTruthy();

    // Toast registration is expected and ensures a single manager-level toaster.
    expect(getRenderById(TOAST_ID)).toBeDefined();
  });
});
