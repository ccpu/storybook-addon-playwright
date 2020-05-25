import { useEffect, useState } from 'react';
import { SET } from '@storybook/addon-knobs/dist/shared';
import { KnobStoreKnob } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';
import addons from '@storybook/addons';

export const useKnobs = () => {
  const [knobs, setKnobs] = useState<KnobStoreKnob[]>();

  useEffect(() => {
    setKnobs(undefined);
    const chanel = addons.getChannel();

    const setKnobStore = (knobStore) => {
      const knobArr = Object.keys(knobStore.knobs)
        .map((knob) => {
          return knobStore.knobs[knob] as KnobStoreKnob;
        })
        .filter((x) => x.value !== x.defaultValue);
      setKnobs(knobArr.length > 0 ? knobArr : undefined);
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
