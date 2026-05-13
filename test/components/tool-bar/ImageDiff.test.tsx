const {
  removeImageDiffResultMock,
  setImageDiffResultsMock,
  testStoryScreenShotsMock,
  useGlobalImageDiffResultsMock,
  useScreenshotDiffTestByTypeMock,
} = vi.hoisted(() => ({
  removeImageDiffResultMock: vi.fn(),
  setImageDiffResultsMock: vi.fn(),
  testStoryScreenShotsMock: vi.fn(),
  useGlobalImageDiffResultsMock: vi.fn(),
  useScreenshotDiffTestByTypeMock: vi.fn(),
}));

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
vi.mock('../../../src/features/screenshot/hooks/use-global-imageDiff-results', () => ({
  useGlobalImageDiffResults: useGlobalImageDiffResultsMock,
}));
vi.mock(
  '../../../src/features/screenshot/hooks/use-screenshot-diff-test-by-type',
  () => ({
    useScreenshotDiffTestByType: useScreenshotDiffTestByTypeMock,
  }),
);

import '../../manual-mocks/react-useEffect';
import { storyData } from '../../configs/story-data';
import { ImageDiff } from '../../../src/components/tool-bar/ImageDiff';
import { ImageDiffMenuItem } from '../../../src/components/tool-bar/ImageDiffMenuItem';
import { Loader } from '../../../src/components/common';
import { ImageDiffResult } from '../../../src/api/typings';
import { shallow } from 'enzyme';
import React from 'react';
import { Badge } from '@material-ui/core';
import { IconButton, ListItem, WithTooltip } from '@storybook/components';
import { toast } from '../../../src/utils/toast';

vi.mocked(useGlobalImageDiffResultsMock).mockImplementation(() => ({
  imageDiffResult: [],
  setImageDiffResult: vi.fn(),
}));

vi.mocked(useScreenshotDiffTestByTypeMock).mockImplementation(() => ({
  imageDiffTestInProgress: false,
  storyData,
  testStoryScreenShots: testStoryScreenShotsMock,
}));

describe('ImageDiff', () => {
  const matchingFileResult = {
    filePath: 'test.stories.playwright.json',
    pass: false,
    screenshotId: 'matching-screenshot-id',
    storyId: 'story-1',
  } as ImageDiffResult;

  const duplicateMatchingFileResult = {
    filePath: 'test.stories.playwright.json',
    pass: false,
    screenshotId: 'matching-screenshot-id-2',
    storyId: 'story-1',
  } as ImageDiffResult;

  const otherMatchingFileResult = {
    filePath: 'test.stories.playwright.json',
    pass: false,
    screenshotId: 'matching-screenshot-id-3',
    storyId: 'story-2',
  } as ImageDiffResult;

  const nonMatchingFileResult = {
    filePath: 'other.stories.playwright.json',
    pass: false,
    screenshotId: 'other-screenshot-id',
    storyId: 'story-3',
  } as ImageDiffResult;

  function setImageDiffResults(results: ImageDiffResult[]) {
    vi.mocked(useGlobalImageDiffResultsMock).mockImplementation(() => ({
      imageDiffResult: results,
      setImageDiffResult: vi.fn(),
    }));
  }

  function setDiffState(
    options: {
      imageDiffTestInProgress?: boolean;
      storyDataOverride?: typeof storyData | undefined;
      testStoryScreenShots?: typeof testStoryScreenShotsMock;
    } = {},
  ) {
    vi.mocked(useScreenshotDiffTestByTypeMock).mockImplementation(() => ({
      imageDiffTestInProgress: options.imageDiffTestInProgress ?? false,
      storyData: options.storyDataOverride ?? storyData,
      testStoryScreenShots: options.testStoryScreenShots ?? testStoryScreenShotsMock,
    }));
  }

  async function clickOnIconButton(wrapper: ReturnType<typeof shallow>) {
    await invokeHandler(wrapper.find(IconButton).props().onClick, {
      currentTarget: { tagName: 'button' },
    } as never);
  }

  function getTooltipWrapper(wrapper: ReturnType<typeof shallow>, onHide = vi.fn()) {
    const tooltipProp = wrapper.find(WithTooltip).props().tooltip as (args: {
      onHide: () => void;
    }) => React.ReactNode;

    return shallow(<div>{tooltipProp({ onHide })}</div>);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');
    vi.spyOn(toast, 'success').mockImplementation(() => 'toast-id');
    setImageDiffResults([]);
    setDiffState();
  });

  it('renders the icon button when there are no failed diffs', () => {
    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    expect(wrapper.find(WithTooltip)).toHaveLength(0);
    expect(wrapper.find(IconButton).props().title).toBe('Run diff test for all stories');
    expect(wrapper.find(Badge)).toHaveLength(0);
    expect(wrapper.find(Loader).props().open).toBeFalsy();
  });

  it('opens the failed-results menu, deduplicates stories, and blocks reruns', async () => {
    setImageDiffResults([
      matchingFileResult,
      duplicateMatchingFileResult,
      otherMatchingFileResult,
      nonMatchingFileResult,
    ]);

    const wrapper = shallow(<ImageDiff target="file" storyData={storyData} />);

    expect(wrapper.find(WithTooltip)).toHaveLength(1);
    expect(wrapper.find(IconButton).props().title).toBe(
      "Run diff test for all stories in './test.stories.tsx' file.",
    );
    expect(wrapper.find(Badge).props().badgeContent).toBe(3);

    await clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).not.toHaveBeenCalled();

    const tooltipWrapper = getTooltipWrapper(wrapper);

    expect(tooltipWrapper.find(ListItem)).toHaveLength(1);
    expect(tooltipWrapper.find(ImageDiffMenuItem)).toHaveLength(2);
    expect(tooltipWrapper.find(ImageDiffMenuItem).at(0).props().imageDiff.storyId).toBe(
      'story-1',
    );
    expect(tooltipWrapper.find(ImageDiffMenuItem).at(1).props().imageDiff.storyId).toBe(
      'story-2',
    );
  });

  it('clears matching file results individually', () => {
    setImageDiffResults([
      matchingFileResult,
      duplicateMatchingFileResult,
      otherMatchingFileResult,
      nonMatchingFileResult,
    ]);

    const wrapper = shallow(<ImageDiff target="file" storyData={storyData} />);
    const onHideMock = vi.fn();
    const tooltipWrapper = getTooltipWrapper(wrapper, onHideMock);

    const clearItem = tooltipWrapper.find(ListItem).first();

    expect(clearItem.props().title).toBe('Clear results');

    invokeHandler(
      clearItem.props().onClick,
      {} as React.MouseEvent<HTMLDivElement, MouseEvent>,
    );

    expect(removeImageDiffResultMock).toHaveBeenCalledWith('matching-screenshot-id');
    expect(removeImageDiffResultMock).toHaveBeenCalledWith('matching-screenshot-id-2');
    expect(removeImageDiffResultMock).toHaveBeenCalledWith('matching-screenshot-id-3');
    expect(removeImageDiffResultMock).not.toHaveBeenCalledWith('other-screenshot-id');
    expect(setImageDiffResultsMock).not.toHaveBeenCalled();
    expect(onHideMock).toHaveBeenCalledTimes(1);
  });

  it('clears all results for non-file targets', () => {
    setImageDiffResults([matchingFileResult]);

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);
    const tooltipWrapper = getTooltipWrapper(wrapper);

    invokeHandler(
      tooltipWrapper.find(ListItem).first().props().onClick,
      {} as React.MouseEvent<HTMLDivElement, MouseEvent>,
    );

    expect(setImageDiffResultsMock).toHaveBeenCalledWith([]);
    expect(removeImageDiffResultMock).not.toHaveBeenCalled();
  });

  it('runs image diff and shows success when all results pass', async () => {
    testStoryScreenShotsMock.mockResolvedValueOnce([{ pass: true }] as ImageDiffResult[]);

    const wrapper = shallow(<ImageDiff target="all" />);

    await clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).toHaveBeenCalledWith('all');
    expect(toast.success).toHaveBeenCalledWith(
      'All screenshot tests are passed successfully.',
      expect.objectContaining({ id: 'image-diff:all-passed' }),
    );
  });

  it('does not show success when the diff call returns no array', async () => {
    testStoryScreenShotsMock.mockResolvedValueOnce(undefined as never);

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).toHaveBeenCalledWith('story');
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('does not show success when at least one screenshot fails', async () => {
    testStoryScreenShotsMock.mockResolvedValueOnce([
      { pass: true },
      { pass: false },
    ] as ImageDiffResult[]);

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    await clickOnIconButton(wrapper);

    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows the loading state when image diff testing is in progress', () => {
    setDiffState({ imageDiffTestInProgress: true });

    const wrapper = shallow(<ImageDiff target="story" storyData={storyData} />);

    expect(wrapper.find(IconButton).props().disabled).toBe(true);
    expect(wrapper.find(Loader).props().open).toBe(true);
  });
});
