import React from 'react';

export default { title: 'Boxes' };

export const withDefault = () => (
  <>
    <div
      id="blue"
      style={{
        backgroundColor: 'blue',
        height: 100,
        left: 60,
        position: 'absolute',
        top: 50,
        width: 100,
      }}
    />
    <div
      id="red"
      style={{
        backgroundColor: 'red',
        height: 100,
        left: 600,
        position: 'absolute',
        top: 500,
        width: 100,
      }}
    />
    <div
      style={{
        backgroundColor: 'green',
        height: 100,
        left: 800,
        position: 'absolute',
        top: 700,
        width: 100,
      }}
    />
  </>
);
