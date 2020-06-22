import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default {
  title: 'Tippy',
};

export const WithTippy = () => {
  return (
    <Tippy content="Tippy.js" placement="bottom-start">
      <button>HOVER ME</button>
    </Tippy>
  );
};
