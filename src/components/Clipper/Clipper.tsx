import React from 'react';
import Selecto from 'react-selecto';
import { create } from 'zustand';
import {
  useKeyPressFn,
  usePreviewIframe,
  useScreenshotOptions,
} from '../../hooks';
import { getIframeScrollPosition } from '../../utils';
import { IframeOverlay } from '../common/IframeOverlay';

export interface ClipperProps {
  clipping: boolean;
  start: () => void;
  stop: () => void;
  toggleClippingState: () => void;
}

export const useClipperState = create<ClipperProps>()((set) => ({
  clipping: false,
  start: () => {
    set(() => ({
      clipping: true,
    }));
  },
  stop: () => {
    set(() => ({
      clipping: false,
    }));
  },
  toggleClippingState: () => {
    set((s) => ({
      clipping: !s.clipping,
    }));
  },
}));

const Clipper: React.FC = () => {
  const { clipping, stop } = useClipperState();

  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const overlayRef = React.useRef<HTMLDivElement>(null);

  const iframe = usePreviewIframe();

  const handleEnd = React.useCallback(
    (e) => {
      if (!overlayRef.current || !iframe) return;
      const iframeScroll = getIframeScrollPosition(iframe);

      const { height, width, top, left } = e.rect as DOMRect;

      const overlayRect = overlayRef.current.getBoundingClientRect();

      const clipperPos = {
        left: iframeScroll.scrollLeft + left,
        top: iframeScroll.scrollTop + top,
      };

      setScreenshotOptions({
        ...screenshotOptions,
        clip: {
          height,
          width,
          x: clipperPos.left - overlayRect.left,
          y: clipperPos.top - overlayRect.top,
        },
      });

      stop();
    },
    [iframe, screenshotOptions, setScreenshotOptions, stop],
  );

  useKeyPressFn(undefined, (e) => {
    if (e.code === 'Escape') stop();
  });

  if (!clipping) return null;

  return (
    <IframeOverlay ref={overlayRef}>
      <Selecto
        dragContainer={overlayRef.current}
        hitRate={100}
        selectByClick={true}
        selectFromInside={true}
        ratio={0}
        onSelectEnd={handleEnd}
      ></Selecto>
    </IframeOverlay>
  );
};

Clipper.displayName = 'Clipper';

export { Clipper };
