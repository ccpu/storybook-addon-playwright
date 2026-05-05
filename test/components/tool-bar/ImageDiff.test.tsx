const { removeImageDiffResultMock, setImageDiffResultsMock } = vi.hoisted(
  () => ({
    removeImageDiffResultMock: vi.fn(),
    setImageDiffResultsMock: vi.fn(),
  }),
);

function invokeMock<Args extends unknown[]>(mock: (...args: Args) => unknown) {
  return (...args: Args) => mock(...args);
}

function invokeHandler<Args extends unknown[], Result>(
  handler: ((...args: Args) => Result) | undefined,
  ...args: Args
): Result {
  if (!handler) {
    throw new globalThis.Error('Expected handler to be defined');
  }

  return handler(...args);
}

vi.mock('../../../src/features/screenshot/store/actions', () => ({
  removeImageDiffResult: invokeMock(removeImageDiffResultMock),
  setImageDiffResults: invokeMock(setImageDiffResultsMock),
}));

import '../../manual-mocks/react-useEffect';
import { storyData } from '../../configs/story-data';
import { ImageDiff } from '../../../src/components/tool-bar/ImageDiff';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useScreenshotDiffTestByType } from '../../../src/features/screenshot/hooks/use-screenshot-diff-test-by-type';
import { useGlobalImageDiffResults } from '../../../src/features/screenshot/hooks/use-global-imageDiff-results';
import { ImageDiffResult } from '../../../src/api/typings';
import { Menu, MenuItem } from '@material-ui/core';
import { ImageDiffMenuItem } from '../../../src/components/tool-bar/ImageDiffMenuItem';
import { toast } from '../../../src/utils/toast';

vi.mock(
  '../../../src/features/screenshot/hooks/use-global-imageDiff-results',
  async () =>
    await import(
      '../../features/screenshot/hooks/__mocks__/use-global-imageDiff-results'
    ),
);
vi.mock(
  '../../../src/features/screenshot/hooks/use-screenshot-diff-test-by-type',
  async () => {
    const { useScreenshotImageDiffResults } = await import(
      '../../features/screenshot/hooks/__mocks__/use-screenshot-imageDiff-results'
    );
    return {
      useScreenshotDiffTestByType: useScreenshotImageDiffResults,
    };
  },
);
vi.mock(
  '../../../src/hooks/use-current-story-data',
  async () => await import('../../hooks/__mocks__/use-current-story-data'),
);

const testStoryScreenShotsMock = vi.fn();
vi.mocked(useScreenshotDiffTestByType).mockImplementation(() => {
  return {
    imageDiffTestInProgress: false,
    storyData: {
      fileName: 'story.ts',
      filePath: './test.stories.tsx',
      id: 'story-id',
      name: 'Story Name',
      parent: 'Story Parent',
    },
    testStoryScreenShots: testStoryScreenShotsMock,
  };
});

describe('ImageDiff', () => {
  const imageDiffResult = [
    {
      filePath: 'test.stories.playwright.json',
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
    await invokeHandler(wrapper.find(IconButton).props().onClick, {
      currentTarget: { tagName: 'button' },
    } as never);
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

    expect(toast.success).toHaveBeenCalledWith(
      'All screenshot tests are passed successfully.',
      expect.any(Object),
    );
  });

  it('should not show success if has a result with pass=false', async () => {
    testStoryScreenShotsMock.mockImplementationOnce(
      () => [{ pass: false }] as ImageDiffResult[],
    );

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(toast.success).toHaveBeenCalledTimes(0);
  });

  it('should show menu', () => {
    (useGlobalImageDiffResults as Mock).mockImplementationOnce(() => ({
      imageDiffResult: [
        {
          filePath: 'test.stories.playwright.json',
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

    invokeHandler(
      clearItem.props().onClick,
      {} as React.MouseEvent<HTMLLIElement, MouseEvent>,
    );

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

    invokeHandler(
      clearItem.props().onClick,
      {} as React.MouseEvent<HTMLLIElement, MouseEvent>,
    );

    expect(removeImageDiffResultMock).toHaveBeenCalledWith('screenshot-id');
  });

  it('should show error server throw error', async () => {
    testStoryScreenShotsMock.mockImplementationOnce(() => undefined);

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(toast.success).toHaveBeenCalledTimes(0);
  });
});
