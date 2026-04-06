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
import '../src/register';

describe('register', () => {
  it('should add', () => {
    const data = addons.add as Mock;
    expect(data).toHaveBeenCalledTimes(4);

    const ToolComponent = data.mock.calls[0][1].render;
    const tool = shallow(<ToolComponent />);
    expect(tool.exists()).toBe(true);

    const ActionPanel = data.mock.calls[1][1].render;
    const actionPanelWrapper = shallow(<ActionPanel />);
    expect(actionPanelWrapper.exists()).toBe(true);

    const ScreenshotPanel = data.mock.calls[2][1].render;
    const screenshotPanelWrapper = shallow(<ScreenshotPanel />);
    expect(screenshotPanelWrapper.exists()).toBe(true);

    const Preview = data.mock.calls[3][1].render;
    const previewWrapper = shallow(<Preview />);
    expect(previewWrapper.exists()).toBeTruthy();
  });
});
