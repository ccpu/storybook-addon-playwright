import { dispatchMock } from '../../../__manual_mocks__/hooks/use-global-action-dispatch';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLoadScreenshotSettings } from '../use-load-screenshot-settings';
import { ScreenshotData } from '../../typings';
import { useScreenshotOptions } from '../use-screenshot-options';
import { useBrowserOptions } from '../use-browser-options';

vi.mock('../use-current-story-data');
vi.mock('../use-browser-options.ts');
vi.mock('../use-screenshot-options.ts');

vi.unmock('@storybook/manager-api');

const emitMock = vi.fn();

vi.mock('@storybook/manager-api', () => ({
  useStorybookApi: () => ({
    emit: emitMock,
  }),
}));

describe('useLoadScreenshotSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    emitMock.mockClear();
  });

  const getData = (opt?: Partial<ScreenshotData>) => {
    const data: ScreenshotData = {
      actionSets: [
        {
          actions: [
            {
              id: 'action-id',
              name: 'action-name',
            },
          ],
          id: 'action-set-id',
          title: 'action-set-title',
        },
      ],

      browserType: 'chromium',
      id: 'screenshot-id',

      title: 'title',
      ...opt,
    };
    return data;
  };

  it('should load', () => {
    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      result.current.loadSetting(getData());
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      actionSets: [
        {
          actions: [{ id: 'action-id', name: 'action-name' }],
          id: 'action-set-id',
          title: 'action-set-title',
        },
      ],
      storyId: 'story-id',
      type: 'setScreenShotActionSets',
    });
  });

  it('should not load actions', () => {
    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      const data = getData();
      delete data.actionSets;
      result.current.loadSetting(data);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });

  it('should reset and emit args to update story', () => {
    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      const data = getData();
      data.props = { prop: 'prop-val' };
      result.current.loadSetting(data);
    });

    expect(emitMock).toHaveBeenCalledWith('resetStoryArgs', {
      storyId: 'story-id',
    });
    expect(emitMock).toHaveBeenCalledWith('updateStoryArgs', {
      storyId: 'story-id',
      updatedArgs: { prop: 'prop-val' },
    });
  });

  it('should set screenshotOptions and browserOptions', () => {
    const setScreenshotOptionsMock = vi.fn();
    const setBrowserOptionsMock = vi.fn();
    (useScreenshotOptions as Mock).mockImplementation(() => ({
      setScreenshotOptions: setScreenshotOptionsMock,
    }));
    (useBrowserOptions as Mock).mockImplementation(() => ({
      setBrowserOptions: setBrowserOptionsMock,
    }));

    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      const data = getData({
        browserOptions: { deviceName: 'iphone' },
        screenshotOptions: { fullPage: true },
      });
      delete data.actionSets;
      result.current.loadSetting(data);
    });

    expect(setScreenshotOptionsMock).toHaveBeenCalledWith({ fullPage: true });
    expect(setBrowserOptionsMock).toHaveBeenCalledWith('all', {
      deviceName: 'iphone',
    });
  });
});
