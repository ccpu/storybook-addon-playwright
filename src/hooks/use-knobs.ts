import { useEffect, useState } from 'react';
import { STORY_ARGS_UPDATED, STORY_CHANGED } from '@storybook/core-events';
import { ScreenshotProp } from '../typings';
import { addons } from '@storybook/manager-api';

export const useKnobs = () => {
  const [props, setProps] = useState<ScreenshotProp>();

  useEffect(() => {
    setProps(undefined);
    const channel = addons.getChannel();
    const setArgsStore = (data: {
      storyId: string;
      args: Record<string, unknown>;
    }) => {
      if (!data || !data.args) return;
      const propObj = Object.keys(data.args).reduce((obj, key) => {
        if (data.args[key] !== undefined) {
          obj[key] = data.args[key];
        }
        return obj;
      }, {} as ScreenshotProp);

      setProps(Object.keys(propObj).length > 0 ? propObj : undefined);
    };

    const storyChange = () => {
      setProps(undefined);
    };

    channel.on(STORY_ARGS_UPDATED, setArgsStore);

    channel.on(STORY_CHANGED, storyChange);

    return () => {
      channel.off(STORY_ARGS_UPDATED, setArgsStore);
      channel.off(STORY_CHANGED, storyChange);
    };
  }, []);

  return props;
};
