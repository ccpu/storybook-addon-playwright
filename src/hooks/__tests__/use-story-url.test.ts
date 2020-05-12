import { useStoryUrl } from '../use-story-url';
import { renderHook } from '@testing-library/react-hooks';

describe('useStoryUrl', () => {
  it('should ', () => {
    const { result } = renderHook(() => useStoryUrl());
    expect(result).toStrictEqual({
      current: 'http://192.168.1.1/iframe.html?id=story-id&knob-text=some text',
      error: undefined,
    });
  });
});