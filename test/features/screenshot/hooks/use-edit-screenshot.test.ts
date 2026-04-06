import {
  deleteTempActionSetsMock,
  clearCurrentActionSetsMock,
} from '../../../manual-mocks/store/action/context';
import { useEditScreenshot } from '../../../../src/features/screenshot/hooks/use-edit-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { useCurrentStoryData } from '../../../../src/hooks/use-current-story-data';
import { StoryData } from '../../../../src/typings';
import { useAddonState } from '../../../../src/hooks/use-addon-state';
import { useLoadScreenshotSettings } from '../../../../src/features/screenshot/hooks/use-load-screenshot-settings';

vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);
vi.mock(
  '../../../../src/features/screenshot/hooks/use-load-screenshot-settings',
  async () => await import('./__mocks__/use-load-screenshot-settings'),
);
vi.mock(
  '../../../../src/hooks/use-addon-state',
  async () => await import('../../../hooks/__mocks__/use-addon-state'),
);
vi.mock(
  '../../../../src/hooks/use-browser-options',
  async () => await import('../../../hooks/__mocks__/use-browser-options'),
);

const loadSettingMock = vi.fn();
vi.mocked(useLoadScreenshotSettings).mockImplementation(() => ({
  browserOptions: { all: {} },
  loadSetting: loadSettingMock,
  screenshotOptions: {},
}));

const useCurrentStoryDataMock = vi.mocked(useCurrentStoryData);

describe('useEditScreenshot', () => {
  const setAddonStateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

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
    expect(deleteTempActionSetsMock).toHaveBeenCalledWith('story-id');
    expect(clearCurrentActionSetsMock).toHaveBeenCalled();

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
