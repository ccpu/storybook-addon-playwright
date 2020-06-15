import { constructStoryUrl } from '../construct-story-url';

describe('constructStoryUrl', () => {
  it('should construct http url', () => {
    expect(
      constructStoryUrl('http://localhost:3000', 'story-id', [
        { name: 'prop', value: 'val' },
      ]),
    ).toBe('http://localhost:3000/iframe.html?id=story-id&knob-prop=val');
  });

  it('should construct file ', () => {
    expect(
      constructStoryUrl('./storybook-static', 'story-id', [
        { name: 'prop', value: 'val' },
      ]),
    ).toBe(
      'file:///Z:/github/storybook-addons-playwright/storybook-static/iframe.html?id=story-id&knob-prop=val',
    );
  });
});
