import { ImageDiff } from '../ImageDiff';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useAppScreenshotImageDiff } from '../../../hooks/use-app-screenshot-imageDiff';
// import { useGlobalImageDiffResults } from '../../../hooks/use-global-imageDiff-results';

jest.mock('../../../hooks/use-global-imageDiff-results.ts');
jest.mock('../../../hooks//use-global-action-dispatch.ts');
jest.mock('../../../hooks/use-app-screenshot-imageDiff.ts');

describe('ImageDiff', () => {
  it('should render', () => {
    const wrapper = shallow(<ImageDiff />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should run image diff', () => {
    const testStoryScreenShotsMock = jest.fn();
    (useAppScreenshotImageDiff as jest.Mock).mockImplementationOnce(() => {
      return {
        testStoryScreenShots: testStoryScreenShotsMock,
      };
    });

    const wrapper = shallow(<ImageDiff />);
    const button = wrapper.find(IconButton);
    button
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
  });

  // it('should reset  image diff', () => {
  //   const testStoryScreenShotsMock = jest.fn();
  //   (useAppScreenshotImageDiff as jest.Mock).mockImplementationOnce(() => {
  //     return {
  //       testStoryScreenShots: testStoryScreenShotsMock,
  //     };
  //   });

  //   const wrapper = shallow(<ImageDiff />);
  //   const button = wrapper.find(IconButton);
  //   button
  //     .props()
  //     .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

  //   expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
  // });
});
