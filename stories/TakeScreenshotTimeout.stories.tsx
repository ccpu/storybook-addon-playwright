import React from 'react';

export default { title: 'Timeout' };

export const ShowBoxWithDelay = () => {
  const [showBox, setShowBox] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowBox(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {showBox ? (
        <div
          id="box"
          style={{
            backgroundColor: 'red',
            height: 100,
            width: 100,
          }}
        />
      ) : (
        <p>Wait for the box to appear...</p>
      )}
    </div>
  );
};
