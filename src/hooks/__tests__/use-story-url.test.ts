import { useStoryUrl } from '../use-story-url';
import { renderHook } from '@testing-library/react-hooks';

describe('useStoryUrl', () => {
  it('should useStoryUrl', () => {
    const { result } = renderHook(() => useStoryUrl());
    expect(result.current).toStrictEqual(
      'http://192.168.1.1/iframe.html?id=story-id&knob-text=some text',
    );
  });
});
