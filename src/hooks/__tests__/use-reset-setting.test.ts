import { useResetSetting } from '../use-reset-setting';
import { renderHook } from '@testing-library/react-hooks';
import { useGlobalActionDispatch } from '../../hooks/use-global-action-dispatch';

vi.mock('../../hooks/use-global-action-dispatch');
vi.mock('../use-current-story-data');
vi.unmock('@storybook/manager-api');

const emitMock = vi.fn();

vi.mock('@storybook/manager-api', () => ({
  useStorybookApi: () => ({
    emit: emitMock,
  }),
}));

describe('useResetSetting', () => {
  it('should reset', () => {
    const dispatchMock = vi.fn();
    (useGlobalActionDispatch as Mock).mockImplementationOnce(() => ({
      dispatch: dispatchMock,
    }));
    const { result } = renderHook(() => useResetSetting());

    result.current();

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'clearCurrentActionSets',
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      storyId: 'story-id',
      type: 'deleteTempActionSets',
    });
  });
});
