import addons from '@storybook/addons';
import '../register';
import { shallow } from 'enzyme';
import React from 'react';

describe('register', () => {
  it('should add', () => {
    const data = addons.add as jest.Mock;
    expect(data).toHaveBeenCalledTimes(4);

    const ToolComponent = data.mock.calls[0][1].render;
    const tool = shallow(<ToolComponent />);
    expect(tool.find('Tool')).toHaveLength(1);

    const ActionPanel = data.mock.calls[1][1].render;
    const actionPanelWrapper = shallow(<ActionPanel />);
    expect(actionPanelWrapper.find('ActionPanel')).toHaveLength(1);

    const ScreenshotPanel = data.mock.calls[2][1].render;
    const screenshotPanelWrapper = shallow(<ScreenshotPanel />);
    expect(screenshotPanelWrapper.find('ScreenshotPanel')).toHaveLength(1);

    const Preview = data.mock.calls[3][1].render;
    const previewWrapper = shallow(<Preview />);
    expect(previewWrapper.exists()).toBeTruthy();
  });
});
