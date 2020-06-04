import { useEffect, useState } from 'react';
import { SET } from '@storybook/addon-knobs/dist/shared';
import { ScreenshotProp } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';
import addons from '@storybook/addons';

export const useKnobs = () => {
  const [props, setProps] = useState<ScreenshotProp[]>();

  useEffect(() => {
    setProps(undefined);
    const chanel = addons.getChannel();
    const setKnobStore = (knobStore) => {
      const knobArr = Object.keys(knobStore.knobs)
        .filter((knob) => {
          const knobData = knobStore.knobs[knob];
          return knobData.value !== knobData.defaultValue;
        })
        .map(
          (knob): ScreenshotProp => {
            const knobData = knobStore.knobs[knob];
            const props: ScreenshotProp = {
              name: knobData.name,
              value: knobData.value,
            };
            return props;
          },
        );

      setProps(knobArr.length > 0 ? knobArr : undefined);
    };

    const storyChange = () => {
      setProps(undefined);
    };

    chanel.on(SET, setKnobStore);

    chanel.on(STORY_CHANGED, storyChange);

    return () => {
      chanel.off(SET, setKnobStore);
      chanel.off(STORY_CHANGED, storyChange);
    };
  }, []);

  return props;
};
