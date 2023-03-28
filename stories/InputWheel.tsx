import React from 'react';

const InputWheel: React.FC = () => {
  const [delta, setDelta] = React.useState<{
    deltaY: number;
    deltaX: number;
    deltaZ: number;
    deltaMode: number;
  }>();

  const input = React.useRef<HTMLInputElement>(null);

  const [value, setValue] = React.useState<number>(0);

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

  const handleValueChange = React.useCallback((e) => {
    setValue(e.target.value);
  }, []);

  /**
   * to test fist delay with screenshot
   */
  React.useEffect(() => {
    setTimeout(() => {
      setValue(1);
    }, 150);
  }, []);

  return (
    <div>
      <input
        type="text"
        ref={input}
        value={value}
        onChange={handleValueChange}
        id="input"
      />
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
