import { constructStoryUrl } from '../../src/utils/construct-story-url';
import { ScreenshotProp } from '../../src/typings';

describe('constructStoryUrl', () => {
  it('should construct http url', () => {
    expect(
      constructStoryUrl('http://localhost:3000', 'story-id', { prop: 'val' }),
    ).toBe('http://localhost:3000/iframe.html?id=story-id&knob-prop=val');
  });

  it('should construct file', () => {
    const url = constructStoryUrl('./storybook-static', 'story-id', {
      prop: 'val',
    });
    expect(url.startsWith('file:///')).toBe(true);
  });

  it('should to have valid url', () => {
    const url = constructStoryUrl('localhost:9002', 'my-story');
    expect(url).toBe('http://localhost:9002/iframe.html?id=my-story');
  });

  it('should have knobs', () => {
    const knobs: ScreenshotProp = { 'props-a': 1 };
    const url = constructStoryUrl('localhost:9002', 'my-story', knobs);
    expect(url).toBe(
      'http://localhost:9002/iframe.html?id=my-story&knob-props-a=1',
    );
  });
});
