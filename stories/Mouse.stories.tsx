import React, { useState, useCallback } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import Draggable from 'react-draggable';

export default {
  decorators: [withKnobs],
  title: 'Mouse',
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

export const WithInput = () => {
  const [val, setVal] = useState('Hi');
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  }, []);

  return <input type="text" onChange={handleChange} value={val} />;
};

const StoryDraggable: React.FC = () => {
  return (
    <Draggable>
      <div style={{ background: 'red', height: 100, width: 100 }}></div>
    </Draggable>
  );
};

export const WithDraggable = () => {
  return <StoryDraggable />;
};
