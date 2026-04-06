import { globalDispatchMock } from '../../../manual-mocks/hooks/use-global-screenshot-dispatch';
import { useScreenshotImageDiffResults } from '../../../../src/features/screenshot/hooks/use-screenshot-imageDiff-results';
import { renderHook, act } from '@testing-library/react-hooks';
import { testScreenshots } from '../../../../src/api/trpc/clients/screenshot.client';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../api/trpc/clients/__mocks__/screenshot.client'),
);

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
