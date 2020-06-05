import '../../../../__manual_mocks__/react-useEffect';
import { storyData } from '../../../../__test_data__/story-data';
import { ScreenshotPreviewDialog } from '../ScreenshotPreviewDialog';
import { shallow } from 'enzyme';
import { ScreenshotData, StoryData } from '../../../typings';
import React from 'react';
import { ImageDiffPreviewDialog } from '../../common';
import { ImageDiffResult } from '../../../api/typings';
import fetchMock from 'jest-fetch-mock';
import { act } from '@testing-library/react-hooks';

describe('ScreenshotPreviewDialog', () => {
  const getScreenshotDate = (): ScreenshotData => {
    return {
      browserType: 'chromium',
      hash: 'hash',
      title: 'title',
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render result', async () => {
    const responseMock = fetchMock.mockResponseOnce(
      JSON.stringify({ pass: true } as ImageDiffResult),
    );

    const wrapper = shallow(
      <ScreenshotPreviewDialog
        storyData={storyData as StoryData}
        open={true}
        screenShotData={getScreenshotDate()}
      />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    expect(responseMock).toHaveBeenCalledTimes(1);

    expect(imageDiffPreviewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(imageDiffPreviewDialog.props().titleActions()).toBeDefined();
  });

  it('should show handle close', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ pass: true } as ImageDiffResult),
    );

    const onCLoseMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotPreviewDialog
        storyData={storyData as StoryData}
        open={true}
        screenShotData={getScreenshotDate()}
        onClose={onCLoseMock}
      />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    act(() => {
      imageDiffPreviewDialog.props().onClose();
    });

    expect(onCLoseMock).toHaveBeenCalledTimes(1);
  });
});
