import React, { memo, useEffect, useState, useRef } from 'react';
import { useSelectorManager } from '../../hooks';
import { SelectorOverlay } from './SelectorOverlay';

const Selector: React.FC = memo((props) => {
  const { children } = props;
  const { selectorManager } = useSelectorManager();

  const rootRef = useRef<HTMLDivElement>(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement | undefined>();

  useEffect(() => {
    if (rootRef.current)
      setIframe(rootRef.current.querySelector('iframe') || undefined);
  }, []);

  const isActive = selectorManager && selectorManager.start;

  return (
    <div ref={rootRef} style={{ height: '100%' }}>
      {children}
      {isActive && <SelectorOverlay iframe={iframe} />}
    </div>
  );
});

Selector.displayName = 'Selector';

export { Selector };
