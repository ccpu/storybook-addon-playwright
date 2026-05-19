import { getSelectorPath } from '@dom-utils/selector-path';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useKey, useMouseHovered, useThrottleFn } from 'react-use';
import { useSelectorManager } from '../../hooks';
import { normalizeRootSelectorPath } from './utils';

const useStyles = makeStyles(
  (theme) => {
    return {
      hidden: {
        display: 'none',
        pointerEvents: 'none',
      },
      info: {
        bottom: 0,
        color: theme.palette.primary.main,
        fontSize: 14,
        left: 2,
        pointerEvents: 'none',
        position: 'absolute',
      },
      overlay: {
        backgroundColor: 'transparent',
        bottom: 0,
        cursor: 'crosshair !important',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 100,
      },
      preview: {
        border: `1px solid ${theme.palette.primary.main}`,
        position: 'absolute',
      },
    };
  },
  { name: 'SelectorOverlay' },
);

interface Props {
  iframe?: HTMLIFrameElement;
}

const defaultRect = {
  height: '100%' as unknown as number,
  left: 0,
  right: 0,
  width: '100%' as unknown as number,
} as ClientRect;

const SelectorOverlay: React.FC<Props> = (props) => {
  const { iframe } = props;
  const { stopSelector, selectorManager, setSelectorData } = useSelectorManager();

  const [mouseupRef, setMouseupRef] = useState<HTMLElement>();

  const classes = useStyles();

  const selectorRef = useRef<HTMLDivElement>(null);

  const isIdSelector = selectorManager.type === 'id-selector';
  const isSelector = selectorManager.type === 'selector' || isIdSelector;

  const [selectorInfo, setSelectorInfo] = useState<{
    rect?: ClientRect;
    selector?: string;
  }>({ rect: defaultRect });

  const { elX, elY } = useMouseHovered(selectorRef, {
    bound: true,
    whenHovered: true,
  });

  useKey('Escape', stopSelector, undefined, [setSelectorInfo, stopSelector]);

  useThrottleFn(
    (x, y) => {
      if (iframe && iframe.contentWindow) {
        const iframeDocument = iframe.contentWindow.document;
        const node = iframeDocument.elementFromPoint(x, y);
        if (node) {
          if (isIdSelector) {
            setSelectorInfo({
              rect: node.getBoundingClientRect(),
              selector: node.id ? `#${node.id}` : '',
            });
          } else {
            const path = normalizeRootSelectorPath(
              getSelectorPath(node, { minify: true }),
              iframeDocument,
            );
            if (node.tagName === 'HTML') {
              setSelectorInfo({
                rect: defaultRect,
                selector: path,
              });
            } else {
              setSelectorInfo({
                rect: node.getBoundingClientRect(),
                selector: path,
              });
            }
          }
        } else {
          setSelectorInfo({ ...selectorInfo, rect: undefined });
        }
      }
    },
    150,
    [elX, elY],
  );

  useEffect(() => {
    if (mouseupRef) {
      const isInBoundary = selectorRef.current
        ? selectorRef.current.contains(mouseupRef)
        : false;

      stopSelector();
      setSelectorData({
        path: isInBoundary ? selectorInfo.selector : undefined,
        x: Math.round(elX),
        y: Math.round(elY),
      });
    }
  }, [elX, elY, setSelectorData, mouseupRef, selectorInfo.selector, stopSelector]);

  useEffect(() => {
    const mouseup = (e: MouseEvent): void => {
      setMouseupRef(e.target as HTMLElement);
    };

    const style = document.createElement('STYLE');
    style.innerHTML = `html, body {
      cursor: crosshair !important;
      `;

    const { body } = document;

    document.head.appendChild(style);

    body.addEventListener('mouseup', mouseup);

    return (): void => {
      body.style.cursor = 'inherit';
      body.removeEventListener('mouseup', mouseup);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div ref={selectorRef} className={clsx(classes.overlay)}>
      {selectorManager && selectorInfo && selectorInfo.rect && (
        <>
          <div
            className={clsx(classes.preview, 'selector-preview')}
            style={
              isSelector
                ? {
                    height: selectorInfo.rect.height,
                    left: selectorInfo.rect.left,
                    top: selectorInfo.rect.top,
                    width: selectorInfo.rect.width,
                  }
                : defaultRect
            }
          />

          <div className={classes.info}>
            <div>{`X: ${elX}`}</div>
            <div>{`Y: ${elY}`}</div>
            <div>{selectorInfo.selector}</div>
          </div>
        </>
      )}
    </div>
  );
};

SelectorOverlay.displayName = 'SelectorOverlay';

export { SelectorOverlay };
