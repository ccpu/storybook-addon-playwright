import React, { SFC, memo, useEffect, useState, useRef } from 'react';
import { useSelectorManager } from '../../hooks';
import { SelectorOverlay } from './SelectorOverlay';

const Selector: SFC = memo((props) => {
  const { children } = props;
  const { selectorManager } = useSelectorManager();

  const rootRef = useRef<HTMLDivElement>(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement>();

  useEffect(() => {
    if (rootRef.current) setIframe(rootRef.current.querySelector('iframe'));
  }, []);

  const isActive = selectorManager && selectorManager.start;

  return (
    <div ref={rootRef}>
      {children}
      {isActive && <SelectorOverlay iframe={iframe} />}
    </div>
  );
});

Selector.displayName = 'Selector';

export { Selector };
