import { constructStoryUrl } from '../construct-story-url';
import { parse } from 'url';
import { ScreenshotProp } from '../../typings';

describe('constructStoryUrl', () => {
  it('should construct http url', () => {
    expect(
      constructStoryUrl('http://localhost:3000', 'story-id', { prop: 'val' }),
    ).toBe('http://localhost:3000/iframe.html?id=story-id&knob-prop=val');
  });

  it('should construct file ', () => {
    expect(
      parse(
        constructStoryUrl('./storybook-static', 'story-id', { prop: 'val' }),
      ).protocol,
    ).toBe('file:');
  });

  it('should to have valid url', () => {
    const url = constructStoryUrl('localhost:9001', 'my-story');
    expect(url).toBe('http://localhost:9001/iframe.html?id=my-story');
  });

  it('should have knobs', () => {
    const knobs: ScreenshotProp = { 'props-a': 1 };
    const url = constructStoryUrl('localhost:9001', 'my-story', knobs);
    expect(url).toBe(
      'http://localhost:9001/iframe.html?id=my-story&knob-props-a=1',
    );
  });
});
