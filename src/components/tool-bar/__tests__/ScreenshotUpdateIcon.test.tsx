import { ScreenshotUpdateIcon } from '../ScreenshotUpdateIcon';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotUpdateState } from '../../../hooks/use-screenshot-update-state';
import { mocked } from 'ts-jest/utils';
import { Loader } from '../../common';

jest.mock('../../../hooks/use-screenshot-update-state.ts');

describe('ScreenshotUpdateIcon', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotUpdateIcon target="all" />);
    expect(wrapper.find(IconButton).exists()).toBeTruthy();
    expect(wrapper.find(Loader).props().open).toBeFalsy();
  });

  it('should have loader', () => {
    mocked(useScreenshotUpdateState).mockImplementationOnce(() => ({
      handleClose: jest.fn(),
      handleLoadingDone: jest.fn(),
      runDiffTest: jest.fn(),
      setIsLoadingFinish: jest.fn(),
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
