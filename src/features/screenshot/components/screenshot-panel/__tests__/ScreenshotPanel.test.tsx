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
import '../../../../../../__manual_mocks__/react-useEffect';
import { ScreenshotPanel } from '../ScreenshotPanel';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotDispatch } from '../../../store/context';
import { ScreenshotListToolbar } from '../ScreenshotListToolbar';
import { StoryScreenshotPreview } from '../StoryScreenshotPreview';
import mockConsole from 'jest-mock-console';
import { useScreenshotImageDiffResults } from '../../../hooks/use-screenshot-imageDiff-results';
import { useStoryScreenshotLoader } from '../../../hooks/use-story-screenshot-loader';
import { useDeleteStoryScreenshot } from '../../../hooks/use-delete-story-screenshots';
import { useScreenshotUpdateState } from '../../../hooks/use-screenshot-update-state';
import { StoryData } from '../../../../../../dist/typings';

vi.mock('../../../../../utils/get-preview-iframe.ts');
vi.mock('../../../store/context');
vi.mock('../../../hooks/use-screenshot-imageDiff-results.ts');
// Changed: mock complex hooks to prevent their useEffect chains from triggering
// cascading enzyme state updates (infinite re-render loop in vitest).
// The test only checks ScreenshotPanel's own rendering, not these hooks.
vi.mock('../../../hooks/use-story-screenshot-loader');
vi.mock('../../../hooks/use-delete-story-screenshots');
vi.mock('../../../hooks/use-screenshot-update-state');
vi.mock('../../../../../hooks/use-async-api-call');
vi.mock('../../../../../hooks/use-current-story-data');

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
  runDiffTest: vi.fn(),
  updateInf: { reqBy: undefined, type: undefined },
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
