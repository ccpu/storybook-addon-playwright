import React from 'react';
import Selecto from 'react-selecto';
import { create } from 'zustand';
import { useKeyPressFn, useScreenshotOptions } from '../../hooks';
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

  const handleEnd = React.useCallback(
    (e) => {
      stop();

      if (!overlayRef.current) return;

      const { height, width, top, left } = e.rect as DOMRect;

      const overlayRect = overlayRef.current.getBoundingClientRect();

      setScreenshotOptions({
        ...screenshotOptions,
        clip: {
          height,
          width,
          x: top - overlayRect.top,
          y: left - overlayRect.left,
        },
      });
    },
    [screenshotOptions, setScreenshotOptions, stop],
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
        onDragEnd={handleEnd}
      ></Selecto>
    </IframeOverlay>
  );
};

Clipper.displayName = 'Clipper';

export { Clipper };
