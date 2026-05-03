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

const setPauseDeleteImageDiffResultMock = vi.fn();
const removePassedImageDiffResultMock = vi.fn();

vi.mock('../../../../../src/features/screenshot/store/actions', () => ({
  setPauseDeleteImageDiffResult: (...args: any[]) =>
    setPauseDeleteImageDiffResultMock(...args),
  removePassedImageDiffResult: (...args: any[]) =>
    removePassedImageDiffResultMock(...args),
}));

import { useEffectCleanup } from '../../../../manual-mocks/react-useEffect';
import { StoryScreenshotPreview } from '../../../../../src/features/screenshot/components/screenshot-panel/StoryScreenshotPreview';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotUpdate } from '../../../../../src/features/screenshot/hooks/use-screenshot-update';
import { ScreenshotListPreviewDialog } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListPreviewDialog';
import { useImageDiffScreenshots } from '../../../../../src/features/screenshot/hooks/use-imagediff-screenshots';

import { ScreenshotData } from '../../../../../src/typings';
import { StoryData } from '../../../../../src/schema';
import { useScreenshotStoreState } from '../../../../../src/features/screenshot/store/selectors';

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
  '../../../../../src/features/screenshot/store/selectors',
  async () => await import('../../store/__mocks__/context'),
);

vi.mocked(useScreenshotStoreState).mockImplementation(() => ({
  imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
  pauseDeleteImageDiffResult: false,
  screenshots: [{ id: 'screenshot-id', title: 'title' }] as ScreenshotData[],
}));

vi.mocked(useImageDiffScreenshots).mockImplementationOnce(() => ({
  loaded: true,
  loading: false,
  storyData: {
    fileName: 'test.stories.tsx',
    filePath: './test.stories.tsx',
    id: 'story-id',
    name: 'Story Name',
    parent: 'Story Parent',
  } as StoryData & { fileName: string },
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

    expect(setPauseDeleteImageDiffResultMock).toHaveBeenCalledWith(true);
    expect(setPauseDeleteImageDiffResultMock).toHaveBeenCalledWith(false);
    expect(removePassedImageDiffResultMock).toHaveBeenCalled();
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
    vi.mocked(useScreenshotStoreState).mockImplementation(() => ({
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
