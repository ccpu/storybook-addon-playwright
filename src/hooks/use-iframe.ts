import { useEffect, useRef } from 'react';
import { getIframe } from '../utils';

export const useIframe = () => {
  const iframe = useRef<HTMLIFrameElement>(null);

  if (!iframe.current) {
    iframe.current = getIframe();
  }

  useEffect(() => {
    return () => {
      iframe.current = undefined;
    };
  }, []);

  return iframe.current;
};
