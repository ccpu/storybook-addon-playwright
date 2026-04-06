import { dispatchMock } from '../../../../manual-mocks/store/screenshot/context';
// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import { useEffectCleanup } from '../../../../manual-mocks/react-useEffect';
import { ScreenshotListItem } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListItem';
import { shallow } from 'enzyme';
import React from 'react';
import { storyData } from '../../../../configs/story-data';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import { ImageDiffMessage } from '../../../../../src/components/common';
import { ScreenshotListItemMenu } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListItemMenu';
import { useScreenshotImageDiff } from '../../../../../src/features/screenshot/hooks/use-screenshot-imageDiff';
import { ScreenshotPreviewDialog } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotPreviewDialog';
import { ScreenshotInfo } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotInfo';
import { useEditScreenshot } from '../../../../../src/features/screenshot/hooks/use-edit-screenshot';
import { ScreenshotListItemWrapper } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListItemWrapper';

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-imageDiff',
  async () => await import('../../hooks/__mocks__/use-screenshot-imageDiff'),
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-edit-screenshot',
  async () => await import('../../hooks/__mocks__/use-edit-screenshot'),
);

const loadSettingMock = vi.fn();
const editMock = vi.fn();

const clearScreenshotEditMock = vi.fn();

(useEditScreenshot as Mock).mockImplementation(() => {
  return {
    clearScreenshotEdit: clearScreenshotEditMock,
    editScreenshot: editMock,
    loadSetting: loadSettingMock,
  };
});

describe('ScreenshotListItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
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
    vi.useFakeTimers();
    shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotId: 'screenshot-id' }}
      />,
    );
    vi.advanceTimersByTime(10000);
    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshotId: 'screenshot-id', type: 'removeImageDiffResult' },
    ]);
    vi.useRealTimers();
  });

  it('should remove result from imageDiffResults when pressing on check icon', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotId: 'screenshot-id' }}
      />,
    );

    wrapper
      .find(CheckCircle)
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(dispatchMock).toHaveBeenCalledWith([
      { screenshotId: 'screenshot-id', type: 'removeImageDiffResult' },
    ]);
  });

  it('should not remove result if pauseDeleteImageDiffResult=true', () => {
    const clearTimeoutMock = vi.fn();
    window.clearTimeout = clearTimeoutMock;
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotId: 'screenshot-id' }}
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
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
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
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
        showImageDiffResultDialog
      />,
    );

    const itemWrapper = wrapper.find(ScreenshotListItemWrapper);

    itemWrapper
      .props()
      .onMouseEnter({} as React.MouseEvent<HTMLDivElement, MouseEvent>);

    expect(wrapper.find(ScreenshotListItemMenu).props().show).toBeTruthy();

    itemWrapper
      .props()
      .onMouseLeave({} as React.MouseEvent<HTMLDivElement, MouseEvent>);

    expect(wrapper.find(ScreenshotListItemMenu).props().show).toBeFalsy();
  });

  it('should run image diff', async () => {
    const testScreenshotMock = vi.fn();

    (useScreenshotImageDiff as Mock).mockImplementation(() => {
      return {
        TestScreenshotErrorSnackbar: () => undefined,
        testScreenshot: testScreenshotMock,
      };
    });

    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
        showImageDiffResultDialog
      />,
    );

    await wrapper.find(ScreenshotListItemMenu).props().onRunImageDiff();

    expect(wrapper.find(ImageDiffMessage)).toHaveLength(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(wrapper.find(ImageDiffMessage).props().titleActions().type).toBe(
      ScreenshotInfo,
    );

    expect(testScreenshotMock).toHaveBeenCalledTimes(1);
  });

  it('should show ScreenshotPreviewDialog on item click', async () => {
    const onClickMock = vi.fn();

    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        onClick={onClickMock}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
        showPreviewOnClick
      />,
    );

    wrapper
      .find(ScreenshotListItemWrapper)
      .props()
      .onClick({} as React.MouseEvent<HTMLDivElement, MouseEvent>);

    // await new Promise((resolve) => setImmediate(resolve));

    expect(wrapper.find(ScreenshotPreviewDialog)).toHaveLength(1);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should handle edit screenshot', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
        showPreviewOnClick
      />,
    );

    wrapper.find(ScreenshotListItemMenu).props().onEditClick();

    expect(editMock).toHaveBeenCalledWith({
      browserType: 'chromium',
      id: 'screenshot-id',
      title: 'title',
    });
  });

  it('should handle load screenshot settings', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
        showPreviewOnClick
      />,
    );

    wrapper.find(ScreenshotListItemMenu).props().onLoadSettingClick();

    expect(loadSettingMock).toHaveBeenCalledWith({
      browserType: 'chromium',
      id: 'screenshot-id',
      title: 'title',
    });
  });

  it('should clearTimeout', () => {
    const spyOnClearTimeout = vi.spyOn(window, 'clearTimeout');
    shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: true, screenshotId: 'screenshot-id' }}
        showPreviewOnClick
        pauseDeleteImageDiffResult={false}
      />,
    );
    useEffectCleanup();
    expect(spyOnClearTimeout).toHaveBeenCalledTimes(1);
  });

  it('should cancel screenshot edit mode when screenshot removed', () => {
    const wrapper = shallow(
      <ScreenshotListItem
        storyData={storyData}
        screenshot={getScreenshotDate()}
        imageDiffResult={{ pass: false, screenshotId: 'screenshot-id' }}
        showPreviewOnClick
      />,
    );

    wrapper.find(ScreenshotListItemMenu).props().onDelete();

    expect(clearScreenshotEditMock).toHaveBeenCalledWith();
  });
});
