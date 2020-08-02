import { constructStoryUrl } from '../construct-story-url';
import { ScreenshotProp } from '../../typings';

describe('constructStoryUrl', () => {
  it('should to have valid url', () => {
    const url = constructStoryUrl('localhost:6006', 'my-story');
    expect(url).toBe('http://localhost:6006/iframe.html?id=my-story');
  });
  it('should have knobs', () => {
    const knobs: ScreenshotProp = { 'props-a': 1 };
    const url = constructStoryUrl('localhost:6006', 'my-story', knobs);
    expect(url).toBe(
      'http://localhost:6006/iframe.html?id=my-story&knob-props-a=1',
    );
  });
});
