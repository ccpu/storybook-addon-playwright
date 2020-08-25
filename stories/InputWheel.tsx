import React, { SFC } from 'react';

const InputWheel: SFC = () => {
  const [delta, setDelta] = React.useState<{
    deltaY: number;
    deltaX: number;
    deltaZ: number;
    deltaMode: number;
  }>();

  const input = React.useRef<HTMLInputElement>(null);

  const onMouseWheel = React.useCallback((e: WheelEvent) => {
    setDelta(e);
    return false;
  }, []);

  React.useEffect(() => {
    if (input && input.current) {
      input.current.addEventListener('wheel', onMouseWheel, { passive: true });
    }
    return () => {
      if (input.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        input.current.removeEventListener('wheel', onMouseWheel);
      }
    };
  }, [onMouseWheel]);

  return (
    <div>
      {' '}
      <input type="text" ref={input} />
      {delta && (
        <div>
          deltaMode: {delta.deltaMode}
          <br />
          deltaX: {delta.deltaX}
          <br />
          deltaY: {delta.deltaY}
          <br />
          deltaZ: {delta.deltaZ}
        </div>
      )}
    </div>
  );
};

InputWheel.displayName = 'InputWheel';

export { InputWheel };
