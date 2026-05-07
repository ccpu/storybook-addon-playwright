import { useScreenshot } from '../../../../src/features/screenshot/hooks/use-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { addons } from '@storybook/manager-api';
import { STORY_RENDERED } from '@storybook/core-events';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

vi.mock('../../../../src/hooks/use-knobs', () => ({
  useKnobs: () => {
    return undefined;
  },
}));

vi.mock(
  '../../../../src/utils/get-preview-iframe',
  async () => await import('../../../utils/__mocks__/get-preview-iframe'),
);

describe('useScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return base64', async () => {
    server.use(
      trpcMsw.screenshot.takeScreenshot.mutation(() => ({
        base64: 'base64',
        browserName: 'chromium',
        buffer: { data: [], type: 'Buffer' as const },
      })),
    );

    const { result, waitForNextUpdate } = renderHook(() => useScreenshot('chromium'));

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_RENDERED);
    });

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.screenshot).toMatchObject({ base64: 'base64' });
  });

  it('should not load storybook type', async () => {
    const { result } = renderHook(() => useScreenshot('storybook'));

    expect(result.current.loading).toBe(false);
    expect(result.current.screenshot).toStrictEqual(undefined);
  });
});
