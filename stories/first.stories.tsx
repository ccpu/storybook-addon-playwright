import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

export default {
  decorators: [withKnobs],
  title: 'Tippy',
};

export const WithTippy = () => {
  return (
    <Tippy content="Tippy.js" placement="bottom-start">
      <button disabled={boolean('Disabled', false)}>
        {text('Label', 'Hello Storybook')}
      </button>
    </Tippy>
  );
};
