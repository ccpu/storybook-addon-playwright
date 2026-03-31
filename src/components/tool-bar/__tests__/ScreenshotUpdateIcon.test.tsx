import { ScreenshotUpdateIcon } from '../ScreenshotUpdateIcon';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotUpdateState } from '../../../features/screenshot/hooks/use-screenshot-update-state';
import { Loader } from '../../common';

vi.mock('../../../features/screenshot/hooks/use-screenshot-update-state.ts');

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
