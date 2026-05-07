import { useEffect, useRef } from 'react';
import { getPreviewIframe } from '../utils';

export function usePreviewIframe() {
  const iframe = useRef<HTMLIFrameElement | undefined>(undefined);

  if (!iframe.current) {
    iframe.current = getPreviewIframe() || undefined;
  }

  useEffect(
    () => () => {
      iframe.current = undefined;
    },
    [],
  );

  return iframe.current;
}
