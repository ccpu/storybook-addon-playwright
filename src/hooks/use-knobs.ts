import { useEffect, useState } from 'react';
import { SET } from '@storybook/addon-knobs/dist/shared';
import { ScreenshotProp } from '../typings';
import { STORY_CHANGED } from '@storybook/core-events';
import addons from '@storybook/addons';
import { useEditScreenshot } from './use-edit-screenshot';
import { useStorybookApi } from '@storybook/api';

export const useKnobs = () => {
  const [props, setProps] = useState<ScreenshotProp[]>();

  const { editScreenshotState } = useEditScreenshot();
  const api = useStorybookApi();

  useEffect(() => {
    setProps(undefined);
    const chanel = addons.getChannel();
    const setKnobStore = (knobStore) => {
      const knobArr = Object.keys(knobStore.knobs)
        .filter((knob) => {
          const knobData = knobStore.knobs[knob];
          if (
            editScreenshotState &&
            api.getQueryParam('knob-' + knobData.name)
          ) {
            return true;
          }

          return knobData.value !== knobData.defaultValue;
        })
        .map(
          (knob): ScreenshotProp => {
            const knobData = knobStore.knobs[knob];
            return {
              name: knobData.name,
              value: knobData.value,
            };
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
  }, [api, editScreenshotState]);

  return props;
};
