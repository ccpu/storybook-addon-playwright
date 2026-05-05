import { useEffect, useRef } from 'react';
import { getPreviewIframe } from '../utils';

export const usePreviewIframe = () => {
  const iframe = useRef<HTMLIFrameElement | undefined>(undefined);

  if (!iframe.current) {
    iframe.current = getPreviewIframe() || undefined;
  }

  useEffect(() => {
    return () => {
      iframe.current = undefined;
    };
  }, []);

  return iframe.current;
};
