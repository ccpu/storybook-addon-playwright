import { ScreenshotUpdateIcon } from '../ScreenshotUpdateIcon';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotListUpdateDialog } from '../../../hooks/use-screenshot-list-update-dialog';
import { mocked } from 'ts-jest/utils';
import { Loader } from '../../common';

jest.mock('../../../hooks/use-screenshot-list-update-dialog.ts');

describe('ScreenshotUpdateIcon', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotUpdateIcon target="all" />);
    expect(wrapper.find(IconButton).exists()).toBeTruthy();
    expect(wrapper.find(Loader).props().open).toBeFalsy();
  });

  it('should have loader', () => {
    mocked(useScreenshotListUpdateDialog).mockImplementationOnce(() => ({
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
