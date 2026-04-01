import { globalDispatchMock } from '../../../../../__manual_mocks__/hooks/use-global-screenshot-dispatch';
import { useScreenshotImageDiffResults } from '../use-screenshot-imageDiff-results';
import { renderHook, act } from '@testing-library/react-hooks';
import { testScreenshots } from '../../screenshot.client';

vi.mock('../../../../hooks/use-current-story-data');
vi.mock('../../screenshot.client');

describe('useScreenshotImageDiffResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have result', async () => {
    const { result } = renderHook(() => useScreenshotImageDiffResults());
    await act(async () => {
      await result.current.testStoryScreenShots('all');
    });
    expect(globalDispatchMock).toHaveBeenCalledWith({
      imageDiffResults: [{ pass: true }],
      type: 'setImageDiffResults',
    });
    expect(testScreenshots).toHaveBeenCalledWith({
      fileName: './test.stories.tsx',
      requestId: 'id-1',
      requestType: 'all',
      storyId: 'story-id',
    });
  });

  it('should add story file results only', async () => {
    const { result } = renderHook(() => useScreenshotImageDiffResults());
    await act(async () => {
      await result.current.testStoryScreenShots('file');
    });
    expect(globalDispatchMock).toHaveBeenCalledWith({
      imageDiffResult: { pass: true },
      type: 'addImageDiffResult',
    });

    expect(testScreenshots).toHaveBeenCalledWith({
      fileName: './test.stories.tsx',
      requestId: 'id-2',
      requestType: 'file',
      storyId: 'story-id',
    });
  });

  it('should  story within story file results only', async () => {
    const { result } = renderHook(() => useScreenshotImageDiffResults());
    await act(async () => {
      await result.current.testStoryScreenShots('story');
    });
    expect(globalDispatchMock).toHaveBeenCalledWith({
      imageDiffResult: { pass: true },
      type: 'addImageDiffResult',
    });
    expect(testScreenshots).toHaveBeenCalledWith({
      fileName: './test.stories.tsx',
      requestId: 'id-3',
      requestType: 'story',
      storyId: 'story-id',
    });
  });
});
