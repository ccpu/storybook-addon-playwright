import React from 'react';
import { ScreenshotMain } from '../ScreenshotMain';
import { shallow } from 'enzyme';
import { ScreenshotPanel } from '../ScreenshotPanel';
import { useScreenshotUpdateState } from '../../../hooks/use-screenshot-update-state';
import { mocked } from 'ts-jest/utils';
import { MemoizedStoryScreenshotPreview } from '../StoryScreenshotPreview';

jest.mock('../../../hooks/use-screenshot-update-state.ts');

describe('ScreenshotMain', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotMain showPanel={true} />);
    expect(wrapper.find(ScreenshotPanel).exists()).toBeTruthy();
  });

  it('should render screenshot list preview', () => {
    mocked(useScreenshotUpdateState).mockImplementationOnce(() => ({
      handleClose: jest.fn(),
      handleLoadingDone: jest.fn(),
      runDiffTest: jest.fn(),
      setIsLoadingFinish: jest.fn(),
      updateInf: {
        reqBy: 'req-id',
      },
    }));

    const wrapper = shallow(<ScreenshotMain showPanel={true} />);

    const preview = wrapper.find(MemoizedStoryScreenshotPreview);

    expect(preview.exists()).toBeTruthy();
    expect(wrapper.find(ScreenshotPanel).exists()).toBeTruthy();

    preview.props().onLoad();
    expect(wrapper.find(ScreenshotPanel).exists()).toBeFalsy();

    preview.props().onClose();
    expect(wrapper.find(ScreenshotPanel).exists()).toBeTruthy();
  });
});
