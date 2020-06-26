export const getIframe = jest.fn();

const WithStory = () => true;
const WithStory2 = () => false;

const requiredFunc = (path: string) => {
  if (path === './story.ts') {
    return {
      WithStory,
    };
  }
  if (path === './story-same-func.ts') {
    return {
      WithStory: () => {
        data: true;
      },
    };
  }
  if (path === './story-diff-func.ts') {
    return {
      WithStory2,
    };
  }
  return undefined;
};

requiredFunc.resolve = (path: string) => {
  return path === './story.ts' ? 'actual-relative-path' : undefined;
};

getIframe.mockImplementation(() => ({
  contentWindow: {
    __STORYBOOK_CLIENT_API__: {
      raw: () => [
        { getOriginal: () => WithStory, id: 'story-id', kind: 'story-kind' },
        { getOriginal: () => WithStory, id: 'story-id-2', kind: 'story-kind' },
      ],
    },
    __playwright_addon_hot_reload_time__: 1,
    __playwright_addon_required_context__: [requiredFunc],
  },
}));
