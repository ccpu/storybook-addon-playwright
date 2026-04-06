import { useResetSetting } from '../../src/hooks/use-reset-setting';
import { renderHook } from '@testing-library/react-hooks';
import { useGlobalActionDispatch } from '../../src/features/action-set/hooks/use-global-action-dispatch';

vi.mock(
  '../../src/features/action-set/hooks/use-global-action-dispatch',
  async () =>
    await import(
      '../features/action-set/hooks/__mocks__/use-global-action-dispatch'
    ),
);
vi.mock(
  '../../src/hooks/use-current-story-data',
  async () => await import('./__mocks__/use-current-story-data'),
);
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
