import '../../../../__manual_mocks__/react-useEffect';
import { storyData } from '../../../../__test_data__/story-data';
import { ImageDiff } from '../ImageDiff';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotImageDiffResults } from '../../../hooks/use-screenshot-imageDiff-results';
import { useGlobalImageDiffResults } from '../../../hooks/use-global-imageDiff-results';
import { ImageDiffResult } from '../../../api/typings';
import { Menu, MenuItem } from '@mui/material';
import { ImageDiffMenuItem } from '../ImageDiffMenuItem';
import { mocked } from 'ts-jest/utils';
import { useGlobalScreenshotDispatch } from '../../../hooks';
import { useSnackbar } from '../../../hooks/use-snackbar';
import { StoryData } from '../../../typings';

jest.mock('../../../hooks/use-snackbar');

const openSnackbarMock = jest.fn();

mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

jest.mock('../../../hooks/use-global-imageDiff-results.ts');
jest.mock('../../../hooks/use-screenshot-imageDiff-results.ts');
jest.mock('../../../hooks/use-global-screenshot-dispatch.ts');
jest.mock('../../../hooks/use-current-story-data');

const screenshotDispatchMock = jest.fn();
mocked(useGlobalScreenshotDispatch).mockImplementation(() => ({
  dispatch: screenshotDispatchMock,
}));

const testStoryScreenShotsMock = jest.fn();
mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    ErrorSnackbar: () => React.createElement('div'),
    clearImageDiffError: jest.fn(),
    imageDiffTestInProgress: false,
    storyData: {
      id: 'story-id',
      parameters: { fileName: 'story.ts' },
    } as StoryData,
    storyImageDiffError: 'error',
    testStoryScreenShots: testStoryScreenShotsMock,
  };
});

describe('ImageDiff', () => {
  const imageDiffResult = [
    {
      fileName: 'test.stories.playwright.json',
      pass: true,
      screenshotId: 'screenshot-id',
    },
  ] as ImageDiffResult[];

  beforeEach(() => {
    (useGlobalImageDiffResults as jest.Mock).mockImplementation(() => {
      return { imageDiffResult: [] };
    });

    jest.clearAllMocks();
  });

  async function clickOnIconButton(
    wrapper: ShallowWrapper<
      unknown,
      Readonly<unknown>,
      React.Component<unknown, unknown, unknown>
    >,
  ) {
    await wrapper
      .find(IconButton)
      .props()
      .onClick({ currentTarget: { tagName: 'button' } } as never);
  }

  it('should render', () => {
    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show/hide menu with the list of story that failed image diff test', async () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);

    //should do nothing if anchor set, fixes
    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);
    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(0);
  });

  it('should run image diff and show/hide success msg', async () => {
    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    testStoryScreenShotsMock.mockImplementationOnce((): ImageDiffResult[] => {
      return [];
    });

    await clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);

    expect(openSnackbarMock.mock.calls[0][0]).toBe(
      'All screenshot tests are passed successfully.',
    );
  });

  it('should not show success if has a result with pass=false', async () => {
    testStoryScreenShotsMock.mockImplementationOnce(
      () => [{ pass: false }] as ImageDiffResult[],
    );

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(openSnackbarMock).toHaveBeenCalledTimes(0);
  });

  it('should show menu', () => {
    (useGlobalImageDiffResults as jest.Mock).mockImplementationOnce(() => ({
      imageDiffResult: [
        {
          fileName: 'test.stories.playwright.json',
          pass: true,
          screenshotId: 'screenshot-id',
        },
      ] as ImageDiffResult[],
    }));
    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);
    expect(wrapper.find(Menu)).toHaveLength(1);
  });

  it('should clear result', async () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);

    const clearItem = wrapper.find(MenuItem).first();

    expect(clearItem.text()).toBe('Clear results');

    clearItem
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(wrapper.find(Menu)).toHaveLength(0);
  });

  it('should hide menu on item click', async () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(wrapper.find(Menu).props().anchorEl).not.toBe(null);

    wrapper.find(ImageDiffMenuItem).last().props().onClick();

    expect(wrapper.find(Menu).props().anchorEl).toBe(null);
  });

  it('should test story file', () => {
    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).toHaveBeenCalledWith('story');
  });

  it('should remove only story file image diff', async () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementation(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff target="file" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);

    const clearItem = wrapper.find(MenuItem).first();

    expect(clearItem.text()).toBe('Clear results');

    clearItem
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(screenshotDispatchMock).toHaveBeenCalledWith({
      screenshotId: 'screenshot-id',
      type: 'removeImageDiffResult',
    });
  });

  it('should show error server throw error', async () => {
    testStoryScreenShotsMock.mockImplementationOnce(() => new Error('ops'));

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(openSnackbarMock.mock.calls[0][0]).toBe('ops');
  });
});
