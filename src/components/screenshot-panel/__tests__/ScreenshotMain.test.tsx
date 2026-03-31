import React from 'react';
import { ScreenshotMain } from '../ScreenshotMain';
import { shallow } from 'enzyme';
import { ScreenshotPanel } from '../ScreenshotPanel';
import { useScreenshotUpdateState } from '../../../hooks/use-screenshot-update-state';
import { MemoizedStoryScreenshotPreview } from '../StoryScreenshotPreview';

vi.mock('../../../hooks/use-screenshot-update-state.ts');

describe('ScreenshotMain', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotMain showPanel={true} />);
    expect(wrapper.find(ScreenshotPanel).exists()).toBeTruthy();
  });

  it('should render screenshot list preview', () => {
    vi.mocked(useScreenshotUpdateState).mockImplementationOnce(() => ({
      handleClose: vi.fn(),
      handleLoadingDone: vi.fn(),
      runDiffTest: vi.fn(),
      setIsLoadingFinish: vi.fn(),
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
