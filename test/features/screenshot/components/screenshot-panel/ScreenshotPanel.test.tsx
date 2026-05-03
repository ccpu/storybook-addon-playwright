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

const setPauseDeleteImageDiffResultMock = vi.fn();

vi.mock('../../../../../src/features/screenshot/store/actions', () => ({
  setPauseDeleteImageDiffResult: (...args: any[]) =>
    setPauseDeleteImageDiffResultMock(...args),
}));
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotPanel } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotPanel';
import { shallow } from 'enzyme';
import React from 'react';
import { ScreenshotListToolbar } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListToolbar';
import { StoryScreenshotPreview } from '../../../../../src/features/screenshot/components/screenshot-panel/StoryScreenshotPreview';
import { Loader, Snackbar } from '../../../../../src/components/common';
import mockConsole from 'jest-mock-console';
import { useScreenshotImageDiffResults } from '../../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results';
import { useStoryScreenshotLoader } from '../../../../../src/features/screenshot/hooks/use-story-screenshot-loader';
import { useDeleteStoryScreenshot } from '../../../../../src/features/screenshot/hooks/use-delete-story-screenshots';
import { useScreenshotUpdateState } from '../../../../../src/features/screenshot/hooks/use-screenshot-update-state';
import { StoryData } from '../../../../../src/schema';

vi.mock(
  '../../../../../src/utils/get-preview-iframe',
  async () => await import('../../../../utils/__mocks__/get-preview-iframe'),
);
vi.mock(
  '../../../../../src/features/screenshot/store/selectors',
  async () => await import('../../store/__mocks__/context'),
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results',
  async () =>
    await import('../../hooks/__mocks__/use-screenshot-imageDiff-results'),
);
// Changed: mock complex hooks to prevent their useEffect chains from triggering
// cascading enzyme state updates (infinite re-render loop in vitest).
// The test only checks ScreenshotPanel's own rendering, not these hooks.
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-story-screenshot-loader',
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-delete-story-screenshots',
);
vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-update-state',
  async () => await import('../../hooks/__mocks__/use-screenshot-update-state'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);

const testStoryScreenShotsMock = vi.fn();
vi.mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    clearImageDiffError: vi.fn(),
    imageDiffTestInProgress: false,
    storyData: {
      fileName: 'test.stories.tsx',
      filePath: './test.stories.tsx',
      id: 'story-id',
      name: 'Story Name',
      parent: 'Story Parent',
    } as StoryData & { fileName: string },
    storyImageDiffError: '',
    testStoryScreenShots: testStoryScreenShotsMock,
  };
});
vi.mocked(useStoryScreenshotLoader).mockImplementation(() => ({
  error: undefined,
  loadScreenShots: vi.fn(),
  screenshotLoaderInProgress: false,
  storyData: undefined,
}));
vi.mocked(useDeleteStoryScreenshot).mockImplementation(() => ({
  deleteInProgress: false,
  deleteStoryScreenshots: vi.fn(),
}));
vi.mocked(useScreenshotUpdateState).mockImplementation(() => ({
  handleClose: vi.fn(),
  runDiffTest: vi.fn(),
  setIsLoadingFinish: vi.fn(),
  updateInf: { reqBy: undefined, target: undefined },
}));

describe('ScreenshotPanel', () => {
  let restoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ScreenshotPanel />);
    expect(wrapper.exists()).toBeTruthy();
    expect(setPauseDeleteImageDiffResultMock).toHaveBeenCalledWith(false);
  });

  it('should show StoryScreenshotPreview', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onPreviewClick();

    expect(wrapper.find(StoryScreenshotPreview).exists()).toBeTruthy();
  });

  it('should run update on update click', async () => {
    const runDiffTest = vi.fn();
    vi.mocked(useScreenshotUpdateState).mockImplementationOnce(() => ({
      handleClose: vi.fn(),
      runDiffTest,
      setIsLoadingFinish: vi.fn(),
      updateInf: { reqBy: undefined, target: undefined },
    }));

    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onUpdateClick();

    expect(runDiffTest).toHaveBeenCalledTimes(1);
  });

  it('should show StoryScreenshotPreview run diff test', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onTestClick();

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
  });

  it('should open loader while screenshot list is loading', () => {
    vi.mocked(useStoryScreenshotLoader).mockImplementationOnce(() => ({
      error: undefined,
      loadScreenShots: vi.fn(),
      screenshotLoaderInProgress: true,
      storyData: undefined,
    }));

    const wrapper = shallow(<ScreenshotPanel />);

    expect(wrapper.find(Loader).props().open).toBe(true);
  });

  it('should render image diff error snackbar and handle retry/close', () => {
    const clearImageDiffError = vi.fn();

    vi.mocked(useScreenshotImageDiffResults).mockImplementationOnce(() => ({
      clearImageDiffError,
      imageDiffTestInProgress: false,
      storyData: {
        fileName: 'test.stories.tsx',
        filePath: './test.stories.tsx',
        id: 'story-id',
        name: 'Story Name',
        parent: 'Story Parent',
      } as StoryData & { fileName: string },
      storyImageDiffError: 'image diff error',
      testStoryScreenShots: testStoryScreenShotsMock,
    }));

    const wrapper = shallow(<ScreenshotPanel />);
    const snackbar = wrapper.find(Snackbar);

    expect(snackbar.exists()).toBe(true);
    expect(snackbar.props().message).toBe('image diff error');

    const action = snackbar.props().action as React.ReactElement;
    action.props.onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    snackbar.props().onClose();

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
    expect(clearImageDiffError).toHaveBeenCalledTimes(1);
  });
});
