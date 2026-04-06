const removeImageDiffResultMock = vi.fn();
const setImageDiffResultsMock = vi.fn();

vi.mock('../../../src/features/screenshot/store/actions', () => ({
  removeImageDiffResult: (...args: any[]) => removeImageDiffResultMock(...args),
  setImageDiffResults: (...args: any[]) => setImageDiffResultsMock(...args),
}));

import '../../manual-mocks/react-useEffect';
import { storyData } from '../../configs/story-data';
import { ImageDiff } from '../../../src/components/tool-bar/ImageDiff';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotImageDiffResults } from '../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results';
import { useGlobalImageDiffResults } from '../../../src/features/screenshot/hooks/use-global-imageDiff-results';
import { ImageDiffResult } from '../../../src/api/typings';
import { Menu, MenuItem } from '@material-ui/core';
import { ImageDiffMenuItem } from '../../../src/components/tool-bar/ImageDiffMenuItem';
import { useSnackbar } from '../../../src/hooks/use-snackbar';
import { StoryData } from '../../../src/typings';

vi.mock(
  '../../../src/hooks/use-snackbar',
  async () => await import('../../hooks/__mocks__/use-snackbar'),
);

const openSnackbarMock = vi.fn();

vi.mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

vi.mock(
  '../../../src/features/screenshot/hooks/use-global-imageDiff-results',
  async () =>
    await import(
      '../../features/screenshot/hooks/__mocks__/use-global-imageDiff-results'
    ),
);
vi.mock(
  '../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results',
  async () =>
    await import(
      '../../features/screenshot/hooks/__mocks__/use-screenshot-imageDiff-results'
    ),
);
vi.mock(
  '../../../src/hooks/use-current-story-data',
  async () => await import('../../hooks/__mocks__/use-current-story-data'),
);

const testStoryScreenShotsMock = vi.fn();
vi.mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    ErrorSnackbar: () => React.createElement('div'),
    clearImageDiffError: vi.fn(),
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
    (useGlobalImageDiffResults as Mock).mockImplementation(() => {
      return { imageDiffResult: [] };
    });

    vi.clearAllMocks();
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
    (useGlobalImageDiffResults as Mock)
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
    (useGlobalImageDiffResults as Mock).mockImplementationOnce(() => ({
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
    (useGlobalImageDiffResults as Mock)
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
    (useGlobalImageDiffResults as Mock)
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
    (useGlobalImageDiffResults as Mock)
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

    expect(removeImageDiffResultMock).toHaveBeenCalledWith('screenshot-id');
  });

  it('should show error server throw error', async () => {
    testStoryScreenShotsMock.mockImplementationOnce(() => new Error('ops'));

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(openSnackbarMock.mock.calls[0][0]).toBe('ops');
  });
});
