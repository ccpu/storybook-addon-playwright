import { useEffect, useState } from 'react';
import { SET } from '@storybook/addon-knobs';
import { KnobStore } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';
import addons from '@storybook/addons';
// import isEqual  from 'react-fast-compare';

export const useKnobs = () => {
  const [knobs, setKnobs] = useState<KnobStore>();

  useEffect(() => {
    setKnobs(undefined);
    const chanel = addons.getChannel();

    const setKnobStore = (knobStore) => {
      setKnobs(knobStore.knobs);
    };

    chanel.on(SET, setKnobStore);

    chanel.on(STORY_CHANGED, () => {
      setKnobs(undefined);
    });

    return () => {
      console.log('off');
      chanel.off(SET, setKnobStore);
    };
  }, []);

  return knobs;
};
