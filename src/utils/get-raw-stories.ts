import { getPreviewIframe } from '../utils';

interface StoryItem {
  id: string;
  kind: string;
  name: string;
  story: string;
  parameters: Record<string, unknown>;
  [key: string]: unknown;
}

interface RequiredContext {
  __STORYBOOK_PREVIEW__?: {
    storyStore?: {
      extract: (options?: {
        includeDocsOnly?: boolean;
      }) => Record<string, StoryItem>;
    };
  };
  __STORYBOOK_CLIENT_API__?: {
    raw: () => StoryItem[];
  };
}

export const getRawStories = (): StoryItem[] | undefined => {
  const iframeWindow = getPreviewIframe()
    .contentWindow as unknown as RequiredContext;
  if (!iframeWindow) return undefined;

  // Storybook 8+ uses __STORYBOOK_PREVIEW__
  if (iframeWindow.__STORYBOOK_PREVIEW__?.storyStore) {
    const extracted = iframeWindow.__STORYBOOK_PREVIEW__.storyStore.extract();
    return Object.values(extracted);
  }

  // Fallback for older Storybook versions
  if (iframeWindow.__STORYBOOK_CLIENT_API__) {
    return iframeWindow.__STORYBOOK_CLIENT_API__.raw();
  }

  return undefined;
};
