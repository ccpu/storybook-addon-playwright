import { ScreenshotUpdateIcon } from '../../../src/components/tool-bar/ScreenshotUpdateIcon';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotUpdateState } from '../../../src/features/screenshot/hooks/use-screenshot-update-state';
import { Loader } from '../../../src/components/common';

vi.mock(
  '../../../src/features/screenshot/hooks/use-screenshot-update-state',
  async () =>
    await import(
      '../../features/screenshot/hooks/__mocks__/use-screenshot-update-state'
    ),
);

describe('ScreenshotUpdateIcon', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotUpdateIcon target="all" />);
    expect(wrapper.find(IconButton).exists()).toBeTruthy();
    expect(wrapper.find(Loader).props().open).toBeFalsy();
  });

  it('should have loader', () => {
    vi.mocked(useScreenshotUpdateState).mockImplementationOnce(() => ({
      handleClose: vi.fn(),
      handleLoadingDone: vi.fn(),
      runDiffTest: vi.fn(),
      setIsLoadingFinish: vi.fn(),
      updateInf: {
        inProgress: true,
        reqBy: 'tool-all',
      },
    }));
    const wrapper = shallow(<ScreenshotUpdateIcon target="all" />);

    expect(wrapper.find(IconButton).exists()).toBeTruthy();
    expect(wrapper.find(Loader).props().open).toBeTruthy();
  });
});
