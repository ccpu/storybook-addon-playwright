import { IconButton } from '@storybook/components';
import React from 'react';
import Selecto from 'react-selecto';
import { create } from 'zustand';
import {
  useAddonState,
  useBrowserOptions,
  useKeyPressFn,
  usePreviewIframe,
  useScreenshotOptions,
} from '../../hooks';
import { getIframeScrollPosition, toast } from '../../utils';
import AlertToast, { ToastMessageContainer } from '../../utils/toast/AlertToast';
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
  const { addonState, setAddonState } = useAddonState();
  const { setBrowserOptions, browserOptions } = useBrowserOptions();
  const clippingWarningDismissed = addonState.clippingWarningDismissed ?? false;

  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const overlayRef = React.useRef<HTMLDivElement>(null);

  const iframe = usePreviewIframe();

  const handleEnd = React.useCallback(
    (e) => {
      if (!overlayRef.current || !iframe) return;
      const iframeScroll = getIframeScrollPosition(iframe);

      const { height, width, top, left } = e.rect as DOMRect;

      const iframeDocument = iframe.contentDocument ?? iframe.contentWindow?.document;
      const iframeHeight = iframeDocument
        ? Math.max(
            iframeDocument.body?.scrollHeight || 0,
            iframeDocument.body?.offsetHeight || 0,
            iframeDocument.documentElement.scrollHeight,
            iframeDocument.documentElement.offsetHeight,
            iframeDocument.documentElement.clientHeight,
          )
        : iframe.getBoundingClientRect().height;
      const iframeRect = iframe.getBoundingClientRect();
      const iframeViewportWidth = iframe.contentWindow?.innerWidth ?? iframeRect.width;
      const iframeViewportHeight = iframe.contentWindow?.innerHeight ?? iframeRect.height;
      const iframeClientWidth =
        iframeDocument?.documentElement?.clientWidth ?? iframeRect.width;
      const iframeClientHeight =
        iframeDocument?.documentElement?.clientHeight ?? iframeRect.height;
      const previewWidth = Math.min(iframeRect.width, iframeClientWidth);
      const previewHeight = Math.min(iframeRect.height, iframeClientHeight);
      const previewRight = iframeRect.left + previewWidth;
      const previewBottom = iframeRect.top + previewHeight;

      const rawScaleX = previewWidth ? iframeViewportWidth / previewWidth : 1;
      const rawScaleY = previewHeight ? iframeViewportHeight / previewHeight : 1;
      const scaleX = Number.isFinite(rawScaleX) && rawScaleX > 0 ? rawScaleX : 1;
      const scaleY = Number.isFinite(rawScaleY) && rawScaleY > 0 ? rawScaleY : 1;

      const selectionRight = left + width;
      const selectionBottom = top + height;
      const boundedLeft = Math.max(left, iframeRect.left);
      const boundedTop = Math.max(top, iframeRect.top);
      const boundedRight = Math.min(selectionRight, previewRight);
      const boundedBottom = Math.min(selectionBottom, previewBottom);
      const boundedWidth = Math.max(0, boundedRight - boundedLeft);
      const boundedHeight = Math.max(0, boundedBottom - boundedTop);

      if (boundedWidth === 0 || boundedHeight === 0) {
        stop();
        return;
      }

      setBrowserOptions('all', {
        ...(browserOptions.all || {}),
        viewport: {
          height: Math.round(iframeHeight),
          width: Math.round(iframeViewportWidth),
        },
      });

      const clipperPos = {
        left: iframeScroll.scrollLeft + (boundedLeft - iframeRect.left) * scaleX,
        top: iframeScroll.scrollTop + (boundedTop - iframeRect.top) * scaleY,
      };

      setScreenshotOptions({
        ...screenshotOptions,
        clip: {
          height: Math.ceil(boundedHeight * scaleY),
          width: Math.ceil(boundedWidth * scaleX),
          x: Math.floor(clipperPos.left),
          y: Math.floor(clipperPos.top),
        },
      });

      stop();
      if (!clippingWarningDismissed) {
        toast.custom(({ dismiss }) => (
          <AlertToast variant="info" onClose={dismiss}>
            <ToastMessageContainer style={{ fontSize: 14 }}>
              Clipping may differ from the Storybook preview when browser zoom is not
              100%, OS display scaling (DPI) is different, fonts or line height differ,
              text wraps differently, the preview is resized or transformed, or scrollbar
              behavior differs from the Playwright viewport.
            </ToastMessageContainer>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginTop: 8,
              }}
            >
              <IconButton
                type="button"
                onClick={() => {
                  setAddonState({
                    ...addonState,
                    clippingWarningDismissed: true,
                  });
                  dismiss();
                }}
              >
                Do Not Show Again
              </IconButton>
            </div>
          </AlertToast>
        ));
      }
    },
    [
      addonState,
      browserOptions.all,
      iframe,
      clippingWarningDismissed,
      screenshotOptions,
      setBrowserOptions,
      setScreenshotOptions,
      setAddonState,
      stop,
    ],
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
