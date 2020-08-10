import { useResetSetting } from '../use-reset-setting';
import { renderHook } from '@testing-library/react-hooks';
import { useGlobalActionDispatch } from '../../hooks/use-global-action-dispatch';

jest.mock('../../hooks/use-global-action-dispatch');
jest.mock('../use-current-story-data');
jest.unmock('@storybook/api');

const emitMock = jest.fn();

jest.mock('@storybook/api', () => ({
  useStorybookApi: () => ({
    emit: emitMock,
  }),
}));

describe('useResetSetting', () => {
  it('should reset', () => {
    const dispatchMock = jest.fn();
    (useGlobalActionDispatch as jest.Mock).mockImplementationOnce(() => ({
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
