import React, { SFC, memo, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelectorState } from '../../hooks';
import useMouseHovered from 'react-use/lib/useMouseHovered';
import clsx from 'clsx';
// import useDebounce from 'react-use/lib/useDebounce';
import useThrottleFn from 'react-use/lib/useThrottleFn';

const useStyles = makeStyles(
  () => {
    return {
      hidden: {
        display: 'none',
        pointerEvents: 'none',
      },
      overlay: {
        backgroundColor: 'red',
        bottom: 0,
        cursor: 'crosshair !important',
        left: 0,
        opacity: 0.2,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 100,
      },
      preview: {
        border: '2px solid green',
        position: 'absolute',
      },
    };
  },
  { name: 'SelectorOverlay' },
);

const SelectorOverlay: SFC = memo((props) => {
  const { children } = props;
  const { selectorState, setSelectorState } = useSelectorState();
  const iframe = useRef<HTMLIFrameElement>(null);
  const classes = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const [previewRect, setPreviewRect] = useState<ClientRect>({});

  const { elX, elY } = useMouseHovered(selectorRef, {
    bound: true,
    whenHovered: true,
  });

  useThrottleFn(
    (x, y) => {
      if (iframe.current && rootRef.current) {
        const node = iframe.current.contentWindow.document.elementFromPoint(
          x,
          y,
        );
        if (node) {
          setPreviewRect(node.getBoundingClientRect());
        }
        console.log(node);
      }
    },
    150,
    [elX, elY],
  );

  useEffect(() => {
    if (!selectorState) return undefined;
    iframe.current = rootRef.current.querySelector('iframe');
    console.log('test', iframe);
    const mouseup = (): void => {
      setSelectorState({ ...selectorState, showSelectorOverlay: false });
    };
    if (selectorState) {
      document.body.style.cursor = 'crosshair';
      document.body.addEventListener('mouseup', mouseup);
    } else {
      document.body.style.cursor = '';
      document.body.removeEventListener('mouseup', mouseup);
    }

    return (): void => {
      console.log('unmount');
      document.body.style.cursor = '';
      document.body.removeEventListener('mouseup', mouseup);
    };
  }, [selectorState, setSelectorState]);
  console.log(previewRect);
  return (
    <div ref={rootRef}>
      {children}
      <div
        ref={selectorRef}
        className={clsx(classes.overlay, {
          [classes.hidden]:
            !selectorState || !selectorState.showSelectorOverlay,
        })}
      >
        <div className={classes.preview} style={previewRect} />
      </div>
    </div>
  );
});

SelectorOverlay.displayName = 'SelectorOverlay';

export { SelectorOverlay };
