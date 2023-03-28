import { useEffect, useRef } from 'react';
import { getPreviewIframe } from '../utils';

export const usePreviewIframe = () => {
  const iframe = useRef<HTMLIFrameElement>(null);

  if (!iframe.current) {
    iframe.current = getPreviewIframe();
  }

  useEffect(() => {
    return () => {
      iframe.current = undefined;
    };
  }, []);

  return iframe.current;
};
