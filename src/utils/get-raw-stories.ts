import { getPreviewIframe } from '../utils';
import { StoreItem } from '@storybook/client-api/dist/ts3.9';

interface RequiredContext {
  __STORYBOOK_CLIENT_API__: {
    raw: () => StoreItem[];
  };
}

export const getRawStories = (): StoreItem[] | undefined => {
  const iframeWindow = getPreviewIframe()
    .contentWindow as unknown as RequiredContext;
  if (!iframeWindow || !iframeWindow.__STORYBOOK_CLIENT_API__) return undefined;
  return iframeWindow.__STORYBOOK_CLIENT_API__.raw();
};
