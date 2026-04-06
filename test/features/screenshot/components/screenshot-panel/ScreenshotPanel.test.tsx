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
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotPanel } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotPanel';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotDispatch } from '../../../../../src/features/screenshot/store/context';
import { ScreenshotListToolbar } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListToolbar';
import { StoryScreenshotPreview } from '../../../../../src/features/screenshot/components/screenshot-panel/StoryScreenshotPreview';
import mockConsole from 'jest-mock-console';
import { useScreenshotImageDiffResults } from '../../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results';
import { useStoryScreenshotLoader } from '../../../../../src/features/screenshot/hooks/use-story-screenshot-loader';
import { useDeleteStoryScreenshot } from '../../../../../src/features/screenshot/hooks/use-delete-story-screenshots';
import { useScreenshotUpdateState } from '../../../../../src/features/screenshot/hooks/use-screenshot-update-state';
import { StoryData } from '../../../../../dist/typings';

vi.mock(
  '../../../../../src/utils/get-preview-iframe',
  async () => await import('../../../../utils/__mocks__/get-preview-iframe'),
);
vi.mock(
  '../../../../../src/features/screenshot/store/context',
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
  '../../../../../src/hooks/use-async-api-call',
  async () => await import('../../../../hooks/__mocks__/use-async-api-call'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);

const testStoryScreenShotsMock = vi.fn();
vi.mocked(useScreenshotImageDiffResults).mockImplementation(() => {
  return {
    ErrorSnackbar: () => <div />,
    clearImageDiffError: vi.fn(),
    imageDiffTestInProgress: false,
    storyData: {} as StoryData,
    storyImageDiffError: '',
    testStoryScreenShots: testStoryScreenShotsMock,
  };
});
vi.mocked(useStoryScreenshotLoader).mockImplementation(() => ({
  ScreenshotLoaderErrorSnackbar: () => <div />,
  error: undefined,
  loadScreenShots: vi.fn(),
  screenshotLoaderInProgress: false,
  storyData: undefined,
}));
vi.mocked(useDeleteStoryScreenshot).mockImplementation(() => ({
  DeleteScreenshotsErrorSnackbar: () => <div />,
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
    const dispatchMock = vi.fn();
    vi.mocked(useScreenshotDispatch).mockImplementationOnce(() => dispatchMock);
    const wrapper = shallow(<ScreenshotPanel />);
    expect(wrapper.exists()).toBeTruthy();
    expect(dispatchMock).toHaveBeenCalledWith({
      state: false,
      type: 'pauseDeleteImageDiffResult',
    });
  });

  it('should show StoryScreenshotPreview', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onPreviewClick();

    expect(StoryScreenshotPreview).toHaveLength(1);
  });

  it('should show StoryScreenshotPreview to preform update', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onUpdateClick();

    expect(StoryScreenshotPreview).toHaveLength(1);
  });

  it('should show StoryScreenshotPreview run diff test', async () => {
    const wrapper = shallow(<ScreenshotPanel />);

    const toolbar = wrapper.find(ScreenshotListToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onTestClick();

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
  });
});
