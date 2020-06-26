import { useScreenshot } from '../use-screenshot';
import { renderHook } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { GetScreenshotResponse } from '../../api/typings';

jest.mock('../use-knobs', () => ({
  useKnobs: () => {
    return undefined;
  },
}));

jest.mock('../../utils/get-iframe.ts');

describe('useScreenshot', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should return base64', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ base64: 'base64' } as GetScreenshotResponse),
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useScreenshot('chromium'),
    );

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
