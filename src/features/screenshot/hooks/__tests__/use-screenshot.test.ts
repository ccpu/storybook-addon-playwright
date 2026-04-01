import { useScreenshot } from '../use-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { getScreenshot } from '../../screenshot.client';
import { addons } from '@storybook/manager-api';
import { STORY_RENDERED } from '@storybook/core-events';

vi.mock('../../../../hooks/use-knobs', () => ({
  useKnobs: () => {
    return undefined;
  },
}));

vi.mock('../../../../utils/get-preview-iframe.ts');
vi.mock('../../screenshot.client');

describe('useScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return base64', async () => {
    vi.mocked(getScreenshot).mockResolvedValueOnce({ base64: 'base64' } as any);

    const { result, waitForNextUpdate } = renderHook(() =>
      useScreenshot('chromium'),
    );

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_RENDERED);
    });

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.screenshot).toStrictEqual({ base64: 'base64' });
  });

  it('should not load storybook type', async () => {
    const { result } = renderHook(() => useScreenshot('storybook'));

    expect(result.current.loading).toBe(false);
    expect(result.current.screenshot).toStrictEqual(undefined);
  });
});
