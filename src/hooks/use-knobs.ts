import { useEffect, useState } from 'react';
import { SET } from '@storybook/addon-knobs/dist/shared';
import { KnobStoreKnob } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';
import addons from '@storybook/addons';
import { useEditScreenshot } from './use-edit-screenshot';
import { useStorybookApi } from '@storybook/api';

export const useKnobs = () => {
  const [knobs, setKnobs] = useState<KnobStoreKnob[]>();

  const { editScreenshotState } = useEditScreenshot();
  const api = useStorybookApi();

  useEffect(() => {
    setKnobs(undefined);
    const chanel = addons.getChannel();
    const setKnobStore = (knobStore) => {
      const knobArr = Object.keys(knobStore.knobs)
        .map((knob) => {
          return knobStore.knobs[knob] as KnobStoreKnob;
        })
        .filter((x) => {
          if (editScreenshotState && api.getQueryParam('knob-' + x.name)) {
            return true;
          }

          return x.value !== x.defaultValue;
        });

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
  }, [api, editScreenshotState]);

  return knobs;
};
