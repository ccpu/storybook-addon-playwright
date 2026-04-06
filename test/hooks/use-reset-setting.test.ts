import {
  clearCurrentActionSetsMock,
  deleteTempActionSetsMock,
} from '../manual-mocks/store/action/context';
import { useResetSetting } from '../../src/hooks/use-reset-setting';
import { renderHook } from '@testing-library/react-hooks';

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
    const { result } = renderHook(() => useResetSetting());

    result.current();

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(clearCurrentActionSetsMock).toHaveBeenCalled();
    expect(deleteTempActionSetsMock).toHaveBeenCalledWith('story-id');
  });
});
