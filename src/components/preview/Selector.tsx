import React, { SFC, memo, useEffect, useRef, useState } from 'react';
import { useSelectorState } from '../../hooks';
import { SelectorOverlay } from './SelectorOverlay';

const Selector: SFC = memo((props) => {
  const { children } = props;
  const { selectorState, setSelectorState } = useSelectorState();

  const rootRef = useRef<HTMLDivElement>(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement>();

  useEffect(() => {
    setIframe(rootRef.current.querySelector('iframe'));
  }, [selectorState, setSelectorState]);

  const isActive = selectorState && selectorState.start;

  return (
    <div ref={rootRef}>
      {children}
      {isActive && <SelectorOverlay iframe={iframe} />}
    </div>
  );
});

Selector.displayName = 'Selector';

export { Selector };
