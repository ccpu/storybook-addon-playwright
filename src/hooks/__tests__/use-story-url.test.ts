import { useStoryUrl } from '../use-story-url';
import { renderHook } from '@testing-library/react-hooks';

describe('useStoryUrl', () => {
  it('should useStoryUrl', () => {
    const { result } = renderHook(() => useStoryUrl());
    expect(result.current.split('?')[1]).toStrictEqual(
      'id=story-id&knob-text=some text',
    );
  });
});
