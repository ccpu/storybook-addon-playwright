import { useScreenshot } from '../use-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { getScreenshot } from '../../features/screenshot/screenshot.client';
import { addons } from '@storybook/manager-api';
import { STORY_RENDERED } from '@storybook/core-events';

jest.mock('../use-knobs', () => ({
  useKnobs: () => {
    return undefined;
  },
}));

jest.mock('../../utils/get-preview-iframe.ts');
jest.mock('../../features/screenshot/screenshot.client');

describe('useScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return base64', async () => {
    mocked(getScreenshot).mockResolvedValueOnce({ base64: 'base64' } as any);

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
