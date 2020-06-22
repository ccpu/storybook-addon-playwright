import React from 'react';
import Tippy from '@tippyjs/react';

export const Button = () => {
  return (
    <Tippy content="Tippy.js" placement="bottom-start">
      <button>HOVER ME</button>
    </Tippy>
  );
};
