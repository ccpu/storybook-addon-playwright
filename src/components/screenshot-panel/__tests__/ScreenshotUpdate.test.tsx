import '../../../../__manual_mocks__/react-useEffect';
import { ScreenshotUpdate } from '../ScreenshotUpdate';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../__test_data__/get-screenshot-date';
import { IconButton } from '@mui/material';
import { testScreenshot } from '../../../api/client/test-screenshot';
import { updateScreenshot } from '../../../api/client/update-screenshot';
import { mocked } from 'ts-jest/utils';
import { ImageDiffPreviewDialog } from '../../common';

jest.mock('../../../store/screenshot/context');
jest.mock('../../../api/client/test-screenshot');
jest.mock('../../../api/client/update-screenshot');
jest.mock('../../../hooks/use-current-story-data');

const testScreenshotMock = mocked(testScreenshot);
const updateScreenshotMock = mocked(updateScreenshot);

describe('ScreenshotUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render', () => {
    const onStateChangeMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={onStateChangeMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(onStateChangeMock).toHaveBeenCalledTimes(1);
  });

  it('should fetch image diff and show ImageDiffPreviewDialog if imageDiffResult prop not provided and save', async () => {
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={jest.fn()}
      />,
    );
    const button = wrapper.find(IconButton).first();
    button
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    expect(imageDiffPreviewDialog).toHaveLength(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(imageDiffPreviewDialog.props().titleActions()).toBeDefined();

    expect(testScreenshotMock).toHaveBeenCalledWith({
      fileName: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(updateScreenshotMock).toHaveBeenCalledTimes(0);

    const footerButtons = imageDiffPreviewDialog
      .props()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .footerActions().props.children as { props: { onClick: () => void } }[];

    await footerButtons[1].props.onClick();

    expect(footerButtons).toHaveLength(2);

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      base64: 'base64-image',
      fileName: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });

  it('should call for update directly if imageDiffResult prop provided', async () => {
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={jest.fn()}
        imageDiffResult={{
          fileName: './test.stories.tsx',
          newScreenshot: 'base64-image',
          pass: true,
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        }}
      />,
    );
    const iconButton = wrapper.find(IconButton).first();

    await iconButton
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    await new Promise((resolve) => setImmediate(resolve));

    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(0);

    expect(testScreenshotMock).toHaveBeenCalledTimes(0);

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      base64: 'base64-image',
      fileName: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });
});
