import { useGlobalActionDispatch } from '../../hooks/use-global-action-dispatch';
import { useEditScreenshot } from '../use-edit-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { useCurrentStoryData } from '../use-current-story-data';
import { StoryData } from '../../typings';
import { useAddonState } from '../use-addon-state';
import { useLoadScreenshotSettings } from '../use-load-screenshot-settings';

vi.mock('../use-global-action-dispatch');
vi.mock('../use-current-story-data');
vi.mock('../use-load-screenshot-settings');
vi.mock('../use-addon-state.ts');
vi.mock('../use-browser-options.ts');

const loadSettingMock = vi.fn();
vi.mocked(useLoadScreenshotSettings).mockImplementation(() => ({
  browserOptions: { all: {} },
  loadSetting: loadSettingMock,
  screenshotOptions: {},
}));

const useCurrentStoryDataMock = vi.mocked(useCurrentStoryData);

describe('useEditScreenshot', () => {
  const dispatchMock = vi.fn();
  const setAddonStateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGlobalActionDispatch as Mock).mockImplementation(() => ({
      dispatch: dispatchMock,
    }));

    (useAddonState as Mock).mockImplementation(() => {
      return {
        addonState: {},
        setAddonState: setAddonStateMock,
      };
    });
  });

  it('should set edit state', () => {
    const { result } = renderHook(() => useEditScreenshot());

    expect(result.current.isEditing('chromium')).toBe(false);

    act(() => {
      result.current.editScreenshot({
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      });
    });

    expect(result.current.editScreenshotState).toStrictEqual({
      currentBrowserOptions: {},
      currentScreenshotOptions: {},
      screenshotData: {
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      },
      storyId: 'story-id',
    });

    expect(setAddonStateMock).toHaveBeenCalledWith({
      previewPanelEnabled: true,
    });
  });

  it('should clear edit state', () => {
    const { result } = renderHook(() => useEditScreenshot());

    act(() => {
      result.current.editScreenshot({
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      });
    });

    expect(result.current.isEditing('chromium')).toBe(true);
    expect(result.current.isEditing('firefox')).toBe(false);

    act(() => {
      result.current.clearScreenshotEdit();
    });

    expect(result.current.editScreenshotState).toStrictEqual(undefined);
    expect(dispatchMock).toHaveBeenCalledWith({
      storyId: 'story-id',
      type: 'deleteTempActionSets',
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'clearCurrentActionSets',
    });

    expect(loadSettingMock).toHaveBeenNthCalledWith(
      3,
      {
        browserOptions: {},
        browserType: 'chromium',
        id: 'screenshot-id',
        screenshotOptions: {},
        title: 'title',
      },
      true,
    );
  });

  it('should clare editScreenshotState on story change', () => {
    const { result, rerender } = renderHook(() => useEditScreenshot());
    act(() => {
      result.current.editScreenshot({
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      });
    });

    expect(result.current.isEditing('chromium')).toBe(true);

    useCurrentStoryDataMock.mockReturnValueOnce({ id: 'id-2' } as StoryData);

    rerender();

    expect(result.current.isEditing('chromium')).toBe(false);
  });
});
