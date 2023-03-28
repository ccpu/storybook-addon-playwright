import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelectorManager } from '../../hooks';
import useMouseHovered from 'react-use/lib/useMouseHovered';
import clsx from 'clsx';
import useThrottleFn from 'react-use/lib/useThrottleFn';
import { getSelectorPath } from '@dom-utils/selector-path';
import useKey from 'react-use/lib/useKey';

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
        border: '1px solid ' + theme.palette.primary.main,
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
  const { stopSelector, selectorManager, setSelectorData } =
    useSelectorManager();

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
      if (iframe) {
        const node = iframe.contentWindow.document.elementFromPoint(x, y);
        if (node) {
          if (isIdSelector) {
            setSelectorInfo({
              rect: node.getBoundingClientRect(),
              selector: node.id ? '#' + node.id : '',
            });
          } else {
            const path = getSelectorPath(node, { minify: true }).replace(
              'html>body>div:nth-child(3)',
              'html>body>#root',
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
      const isInBoundary = selectorRef.current.contains(mouseupRef);

      stopSelector();
      setSelectorData({
        path: isInBoundary ? selectorInfo.selector : undefined,
        x: elX,
        y: elY,
      });
    }
  }, [
    elX,
    elY,
    setSelectorData,
    mouseupRef,
    selectorInfo.selector,
    stopSelector,
  ]);

  useEffect(() => {
    const mouseup = (e: MouseEvent): void => {
      setMouseupRef(e.target as HTMLElement);
    };

    const style = document.createElement('STYLE');
    style.innerHTML = `html, body {
      cursor: crosshair !important;
      `;

    const body = document.body;

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
