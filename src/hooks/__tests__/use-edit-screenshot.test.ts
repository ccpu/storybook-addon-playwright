import { useGlobalActionDispatch } from '../../hooks/use-global-action-dispatch';
import { useEditScreenshot } from '../use-edit-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { useCurrentStoryData } from '../use-current-story-data';
import { mocked } from 'ts-jest/utils';
import { StoryData } from '../../typings';
import { useAddonState } from '../use-addon-state';

jest.mock('../use-global-action-dispatch');
jest.mock('../use-current-story-data');
jest.mock('../use-load-screenshot-settings');
jest.mock('../use-addon-state.ts');

const useCurrentStoryDataMock = mocked(useCurrentStoryData);

describe('useEditScreenshot', () => {
  const dispatchMock = jest.fn();
  const setAddonStateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalActionDispatch as jest.Mock).mockImplementation(() => ({
      dispatch: dispatchMock,
    }));

    (useAddonState as jest.Mock).mockImplementation(() => {
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
        hash: 'hash',
        title: 'title',
      });
    });

    expect(result.current.editScreenshotState).toStrictEqual({
      screenshotData: { browserType: 'chromium', hash: 'hash', title: 'title' },
      storyId: 'story-id',
    });

    expect(setAddonStateMock).toHaveBeenCalledWith({
      previewPanelEnabled: true,
    });
  });

  it('should cleat edit state', () => {
    const { result } = renderHook(() => useEditScreenshot());

    act(() => {
      result.current.editScreenshot({
        browserType: 'chromium',
        hash: 'hash',
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
      actionSetId: 'hash',
      clearCurrentActionSets: true,
      storyId: 'story-id',
      type: 'deleteActionSet',
    });
  });

  it('should clare editScreenshotState on story change', () => {
    const { result, rerender } = renderHook(() => useEditScreenshot());
    act(() => {
      result.current.editScreenshot({
        browserType: 'chromium',
        hash: 'hash',
        title: 'title',
      });
    });

    expect(result.current.isEditing('chromium')).toBe(true);

    useCurrentStoryDataMock.mockReturnValueOnce({ id: 'id-2' } as StoryData);

    rerender();

    expect(result.current.isEditing('chromium')).toBe(false);
  });
});
