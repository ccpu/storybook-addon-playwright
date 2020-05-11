import { useEffect, useState } from 'react';
import { SET } from '@storybook/addon-knobs/dist/shared';
import { KnobStore } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';
import addons from '@storybook/addons';

export const useKnobs = () => {
  const [knobs, setKnobs] = useState<KnobStore>();

  useEffect(() => {
    setKnobs(undefined);
    const chanel = addons.getChannel();

    const setKnobStore = (knobStore) => {
      setKnobs(knobStore.knobs);
    };

    const storyChange = () => {
      setKnobs(undefined);
    };

    chanel.on(SET, setKnobStore);

    chanel.on(STORY_CHANGED, storyChange);

    return () => {
      chanel.off(SET, setKnobStore);
      chanel.off(STORY_CHANGED, storyChange);
    };
  }, []);

  return knobs;
};
