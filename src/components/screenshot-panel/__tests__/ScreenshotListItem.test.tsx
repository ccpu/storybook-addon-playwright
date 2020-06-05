import { dispatchMock } from '../../../../__manual_mocks__/store/screenshot/context';
import '../../../../__manual_mocks__/react-useEffect';
import { ScreenshotListItem } from '../ScreenshotListItem';
import { shallow } from 'enzyme';
import React from 'react';
import { storyData } from '../../../../__test_data__/story-data';
import { getScreenshotDate } from './data';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import { ImageDiffMessage, ListItemWrapper } from '../../common';
import { ScreenshotListItemMenu } from '../ScreenshotListItemMenu';

describe('ScreenshotListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should remove screenshot result on mount when it passed', () => {
    jest.useFakeTimers();
    shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotHash: 'hash' }}
      />,
    );
    jest.runTimersToTime(10000);
    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshotHash: 'hash', type: 'removeImageDiffResult' },
    ]);
  });

  it('should remove result from imageDiffResults when pressing on check icon', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotHash: 'hash' }}
      />,
    );

    wrapper
      .find(CheckCircle)
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshotHash: 'hash', type: 'removeImageDiffResult' },
    ]);
  });

  it('should not remove result if pauseDeleteImageDiffResult=true ', () => {
    const clearTimeoutMock = jest.fn();
    window.clearTimeout = clearTimeoutMock;
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotHash: 'hash' }}
        pauseDeleteImageDiffResult
      />,
    );

    wrapper
      .find(CheckCircle)
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(dispatchMock).toHaveBeenCalledTimes(0);
    expect(clearTimeoutMock).toHaveBeenCalledTimes(1);
    clearTimeoutMock.mockRestore();
  });

  it('should ImageDiffMessage when image diff not passed', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotHash: 'hash' }}
        showImageDiffResultDialog
      />,
    );

    wrapper
      .find(Error)
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(ImageDiffMessage).toHaveLength(1);
  });

  it('should show/hide menu', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotHash: 'hash' }}
        showImageDiffResultDialog
      />,
    );

    const itemWrapper = wrapper.find(ListItemWrapper);

    itemWrapper
      .props()
      .onMouseEnter({} as React.MouseEvent<HTMLDivElement, MouseEvent>);

    expect(wrapper.find(ScreenshotListItemMenu).props().show).toBeTruthy();

    itemWrapper
      .props()
      .onMouseLeave({} as React.MouseEvent<HTMLDivElement, MouseEvent>);

    expect(wrapper.find(ScreenshotListItemMenu).props().show).toBeFalsy();
  });
});
