const { showImageDiffUpdateFinishedToastMock } = vi.hoisted(() => ({
  showImageDiffUpdateFinishedToastMock: vi.fn(),
}));

vi.mock('../../../../../src/features/screenshot/utils/image-diff-toast', () => ({
  showImageDiffUpdateFinishedToast: showImageDiffUpdateFinishedToastMock,
}));

import React from 'react';
import { ScreenshotMain } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotMain';
import { shallow } from 'enzyme';
import { ScreenshotPanel } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotPanel';
import { useScreenshotUpdateState } from '../../../../../src/features/screenshot/hooks/use-screenshot-update-state';
import { MemoizedStoryScreenshotPreview } from '../../../../../src/features/screenshot/components/screenshot-panel/StoryScreenshotPreview';

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-update-state',
  async () => await import('../../hooks/__mocks__/use-screenshot-update-state'),
);

describe('ScreenshotMain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(4000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
        startedAt: 1000,
        target: 'all',
      },
    }));

    const wrapper = shallow(<ScreenshotMain showPanel={true} />);

    const preview = wrapper.find(MemoizedStoryScreenshotPreview);

    expect(preview.exists()).toBeTruthy();
    expect(wrapper.find(ScreenshotPanel).exists()).toBeTruthy();

    preview.props().onLoad?.();
    expect(wrapper.find(ScreenshotPanel).exists()).toBeFalsy();
    expect(showImageDiffUpdateFinishedToastMock).toHaveBeenCalledWith(
      'Screenshot diff finished in 3s. Review the differences.',
    );

    preview.props().onClose?.();
    expect(wrapper.find(ScreenshotPanel).exists()).toBeTruthy();
  });
});
