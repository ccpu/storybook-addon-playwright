import type { ScreenshotProp } from '../typings';
import { STORY_ARGS_UPDATED, STORY_CHANGED } from '@storybook/core-events';
import { addons, useStorybookApi } from '@storybook/manager-api';
import equal from 'fast-deep-equal';
import { useEffect, useRef, useState } from 'react';

export function useKnobs() {
  const [args, setArgs] = useState<ScreenshotProp>();
  const api = useStorybookApi();
  const apiRef = useRef(api);

  apiRef.current = api;

  useEffect(() => {
    setArgs(undefined);
    const channel = addons.getChannel();
    const setArgsStore = (data: {
      storyId: string;
      args: Record<string, unknown>;
    }) => {
      if (!data || !data.args) return;
      const currentStoryData = apiRef.current.getCurrentStoryData() as
        | { initialArgs?: Record<string, unknown> }
        | undefined;
      const initialArgs = currentStoryData?.initialArgs || {};

      const propObj = Object.keys(data.args).reduce((obj, key) => {
        const argValue = data.args[key];
        if (argValue !== undefined && !equal(argValue, initialArgs[key])) {
          obj[key] = data.args[key];
        }
        return obj;
      }, {} as ScreenshotProp);

      setArgs(Object.keys(propObj).length > 0 ? propObj : undefined);
    };

    const storyChange = () => {
      setArgs(undefined);
    };

    channel.on(STORY_ARGS_UPDATED, setArgsStore);

    channel.on(STORY_CHANGED, storyChange);

    return () => {
      channel.off(STORY_ARGS_UPDATED, setArgsStore);
      channel.off(STORY_CHANGED, storyChange);
    };
  }, []);

  return args;
}
