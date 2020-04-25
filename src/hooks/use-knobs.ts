import { useEffect, useState } from 'react';
import { API } from '@storybook/api';
import { SET } from '@storybook/addon-knobs';
import { KnobStore } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';

export const useKnobs = (api: API) => {
  const [knobs, setKnobs] = useState<KnobStore>();

  useEffect(() => {
    setKnobs(undefined);

    const setKnobStore = (knobStore) => {
      setKnobs(knobStore.knobs);
    };

    api.on(SET, setKnobStore);

    api.on(STORY_CHANGED, () => {
      setKnobs(undefined);
    });

    return () => {
      api.off(SET, setKnobStore);
    };
  }, [api]);

  return knobs;
};
