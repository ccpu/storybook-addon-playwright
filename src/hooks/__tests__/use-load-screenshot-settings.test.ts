import { dispatchMock } from '../../../__manual_mocks__/hooks/use-global-action-dispatch';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLoadScreenshotSettings } from '../use-load-screenshot-settings';
import { ScreenshotData } from '../../typings';

jest.mock('../use-current-story-data');

jest.unmock('@storybook/api');

const emitMock = jest.fn();

jest.mock('@storybook/api', () => ({
  useStorybookApi: () => ({
    emit: emitMock,
  }),
}));

describe('useLoadScreenshotSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    emitMock.mockClear();
  });

  const getData = () => {
    const data: ScreenshotData = {
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserType: 'chromium',
      hash: 'hash',
      title: 'title',
    };
    return data;
  };

  it('should load ', () => {
    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      result.current.loadSetting(getData());
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      actionSet: {
        actions: [{ id: 'action-id', name: 'action-name' }],
        description: 'title actions',
        id: 'hash',
      },
      selected: true,
      storyId: 'story-id',
      type: 'addActionSet',
    });
  });

  it('should not load actions ', () => {
    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      const data = getData();
      delete data.actions;
      result.current.loadSetting(data);
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });

  it('should rest and  emit pops to make knob change', () => {
    const { result } = renderHook(() => useLoadScreenshotSettings());

    act(() => {
      const data = getData();
      data.props = [{ name: 'prop', value: 'prop-val' }];
      result.current.loadSetting(data);
    });

    expect(emitMock).toHaveBeenCalledWith('storybookjs/knobs/reset');
    expect(emitMock).toHaveBeenCalledWith('storybookjs/knobs/change', {
      name: 'prop',
      value: 'prop-val',
    });
  });
});
