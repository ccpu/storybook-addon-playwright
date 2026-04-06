// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
// Also patch the default export so React.useEffect() calls are intercepted too.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import { useEffectCleanup } from '../../../../manual-mocks/react-useEffect';
import { StoryScreenshotPreview } from '../../../../../src/features/screenshot/components/screenshot-panel/StoryScreenshotPreview';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotUpdate } from '../../../../../src/features/screenshot/hooks/use-screenshot-update';
import { ScreenshotListPreviewDialog } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListPreviewDialog';
import { useImageDiffScreenshots } from '../../../../../src/features/screenshot/hooks/use-imagediff-screenshots';

import { StoryData, ScreenshotData } from '../../../../../src/typings';
import {
  useScreenshotContext,
  useScreenshotDispatch,
} from '../../../../../src/features/screenshot/store/context';

import { useSnackbar } from '../../../../../src/hooks/use-snackbar';

vi.mock(
  '../../../../../src/hooks/use-snackbar',
  async () => await import('../../../../hooks/__mocks__/use-snackbar'),
);

const openSnackbarMock = vi.fn();

vi.mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-update',
  async () => await import('../../hooks/__mocks__/use-screenshot-update'),
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-imagediff-screenshots',
  async () => await import('../../hooks/__mocks__/use-imagediff-screenshots'),
);
vi.mock(
  '../../../../../src/features/screenshot/store/context',
  async () => await import('../../store/__mocks__/context'),
);

vi.mocked(useScreenshotContext).mockImplementation(() => ({
  imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
  pauseDeleteImageDiffResult: false,
  screenshots: [{ id: 'screenshot-id', title: 'title' }] as ScreenshotData[],
}));

const dispatchMock = vi.fn();
vi.mocked(useScreenshotDispatch).mockImplementation(() => {
  return (...arg) => {
    return dispatchMock(arg);
  };
});

vi.mocked(useImageDiffScreenshots).mockImplementationOnce(() => ({
  loaded: true,
  loading: false,
  storyData: {} as StoryData,
}));

describe('StoryScreenshotPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <StoryScreenshotPreview target="all" onClose={vi.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should pause and unpause removing image diff result', () => {
    shallow(<StoryScreenshotPreview target="all" onClose={vi.fn()} updating />);

    useEffectCleanup();

    expect(dispatchMock).toHaveBeenCalledWith([
      { state: true, type: 'pauseDeleteImageDiffResult' },
    ]);
    expect(dispatchMock).toHaveBeenCalledWith([
      { state: false, type: 'pauseDeleteImageDiffResult' },
    ]);
    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'removePassedImageDiffResult' },
    ]);
  });

  it('should handle update', async () => {
    const updateScreenshotMock = vi.fn();
    (useScreenshotUpdate as Mock).mockImplementationOnce(() => ({
      updateScreenshot: updateScreenshotMock,
    }));

    const wrapper = shallow(
      <StoryScreenshotPreview target="all" onClose={vi.fn()} updating />,
    );

    const previewDialog = wrapper.find(ScreenshotListPreviewDialog);
    expect(previewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const footerActions = previewDialog.props().footerActions().props.children;

    await footerActions[1].props.onClick();

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      pass: true,
      screenshotId: 'screenshot-id',
    });
  });

  it('should throw if imageDiffResult not found while updating', async () => {
    vi.mocked(useScreenshotContext).mockImplementation(() => ({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id-2' }],
      pauseDeleteImageDiffResult: false,
      screenshots: [
        { id: 'screenshot-id', title: 'title' },
      ] as ScreenshotData[],
    }));

    const wrapper = shallow(
      <StoryScreenshotPreview target="all" onClose={vi.fn()} updating />,
    );

    const previewDialog = wrapper.find(ScreenshotListPreviewDialog);
    expect(previewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const footerActions = previewDialog.props().footerActions().props.children;

    await footerActions[1].props.onClick();

    expect(openSnackbarMock.mock.calls[0][0]).toBe(
      `Unable to find image diff result for 'title' screenshot.`,
    );
  });
});
