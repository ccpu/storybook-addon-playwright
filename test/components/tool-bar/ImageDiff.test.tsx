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
import { IconButton, ListItem, WithTooltip } from '@storybook/components';
import { useScreenshotDiffTestByType } from '../../../src/features/screenshot/hooks/use-screenshot-diff-test-by-type';
import { useGlobalImageDiffResults } from '../../../src/features/screenshot/hooks/use-global-imageDiff-results';
import { ImageDiffResult } from '../../../src/api/typings';
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
    const { useScreenshotDiffTestByType } = await import(
      '../../features/screenshot/hooks/__mocks__/use-screenshot-diff-test-by-type'
    );
    return {
      useScreenshotDiffTestByType,
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
    vi.clearAllMocks();

    (useGlobalImageDiffResults as Mock).mockReset();
    (useGlobalImageDiffResults as Mock).mockImplementation(() => {
      return { imageDiffResult: [] };
    });
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

  function getTooltipWrapper(
    wrapper: ShallowWrapper<
      unknown,
      Readonly<unknown>,
      React.Component<unknown, unknown, unknown>
    >,
    onHide = vi.fn(),
  ) {
    const tooltipProp = wrapper.find(WithTooltip).props().tooltip as (args: {
      onHide: () => void;
    }) => React.ReactNode;

    const tooltip = tooltipProp({ onHide });

    return shallow(<div>{tooltip}</div>);
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

    await clickOnIconButton(wrapper);

    expect(wrapper.find(WithTooltip).props().trigger).toBe('click');

    const tooltipWrapper = getTooltipWrapper(wrapper);

    expect(tooltipWrapper.find(ListItem)).toHaveLength(1);
    expect(tooltipWrapper.find(ImageDiffMenuItem)).toHaveLength(1);

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

    expect(wrapper.find(WithTooltip).props().trigger).toBe('click');

    const tooltipWrapper = getTooltipWrapper(wrapper);

    expect(tooltipWrapper.find(ListItem)).toHaveLength(1);
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

    const onHideMock = vi.fn();
    const tooltipWrapper = getTooltipWrapper(wrapper, onHideMock);

    const clearItem = tooltipWrapper.find(ListItem).first();

    expect(clearItem.props().title).toBe('Clear results');

    invokeHandler(
      clearItem.props().onClick,
      {} as React.MouseEvent<HTMLDivElement, MouseEvent>,
    );

    expect(onHideMock).toHaveBeenCalledTimes(1);
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

    const onHideMock = vi.fn();
    const tooltipWrapper = getTooltipWrapper(wrapper, onHideMock);

    tooltipWrapper.find(ImageDiffMenuItem).last().props().onClick();

    expect(onHideMock).toHaveBeenCalledTimes(1);
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

    const onHideMock = vi.fn();
    const tooltipWrapper = getTooltipWrapper(wrapper, onHideMock);

    const clearItem = tooltipWrapper.find(ListItem).first();

    expect(clearItem.props().title).toBe('Clear results');

    invokeHandler(
      clearItem.props().onClick,
      {} as React.MouseEvent<HTMLDivElement, MouseEvent>,
    );

    expect(removeImageDiffResultMock).toHaveBeenCalledWith('screenshot-id');
    expect(onHideMock).toHaveBeenCalledTimes(1);
  });

  it('should show error server throw error', async () => {
    testStoryScreenShotsMock.mockImplementationOnce(() => undefined);

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(toast.success).toHaveBeenCalledTimes(0);
  });
});
