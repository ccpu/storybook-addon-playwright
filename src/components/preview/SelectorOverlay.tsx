import React, { SFC, memo, useEffect, useRef, useState } from 'react';
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
      path: {
        bottom: 0,
        color: theme.palette.primary.main,
        fontSize: 14,
        left: 2,
        position: 'absolute',
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
  height: ('100%' as unknown) as number,
  left: 0,
  right: 0,
  width: ('100%' as unknown) as number,
} as ClientRect;

const SelectorOverlay: SFC<Props> = memo((props) => {
  const { iframe } = props;
  const {
    stopSelector,
    selectorManager,
    setSelectorData,
  } = useSelectorManager();

  const [mouseupRef, setMouseupRef] = useState<HTMLElement>();

  const classes = useStyles();

  const selectorRef = useRef<HTMLDivElement>(null);

  const isSelector = selectorManager.type === 'selector';

  const [selectorInfo, setSelectorInfo] = useState<{
    rect?: ClientRect;
    selector?: string;
  }>({ rect: defaultRect });

  const { elX, elY } = useMouseHovered(selectorRef, {
    bound: true,
    whenHovered: true,
  });

  useKey(
    'Escape',
    () => {
      stopSelector();
    },
    undefined,
    [setSelectorInfo, stopSelector],
  );

  useThrottleFn(
    (x, y) => {
      if (iframe) {
        const node = iframe.contentWindow.document.elementFromPoint(x, y);
        if (node) {
          if (node.tagName === 'HTML') {
            setSelectorInfo({
              rect: defaultRect,
              selector: getSelectorPath(node),
            });
          } else {
            setSelectorInfo({
              rect: node.getBoundingClientRect(),
              selector: getSelectorPath(node),
            });
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
            className={classes.preview}
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
          {isSelector ? (
            <div className={classes.path}>{selectorInfo.selector}</div>
          ) : (
            <div className={classes.path}>
              <div>{`X: ${elX}`}</div>
              <div>{`Y: ${elY}`}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

SelectorOverlay.displayName = 'SelectorOverlay';

export { SelectorOverlay };
