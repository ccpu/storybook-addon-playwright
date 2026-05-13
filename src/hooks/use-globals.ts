import type { ScreenshotProp } from '../typings';
import { GLOBALS_UPDATED, STORY_CHANGED } from '@storybook/core-events';
import { addons, useStorybookApi } from '@storybook/manager-api';
import equal from 'fast-deep-equal';
import { useEffect, useRef, useState } from 'react';
import { getScreenshotProp } from '../utils';

interface GlobalsUpdatedData {
  globals?: Record<string, unknown>;
  initialGlobals?: Record<string, unknown>;
}

export function useGlobals() {
  const [globals, setGlobals] = useState<ScreenshotProp>();
  const api = useStorybookApi();
  const apiRef = useRef(api);

  apiRef.current = api;

  useEffect(() => {
    setGlobals(undefined);

    const channel = addons.getChannel();

    const setGlobalStore = (data?: GlobalsUpdatedData) => {
      if (!data || !data.globals) {
        setGlobals(undefined);
        return;
      }

      const currentStoryData = apiRef.current.getCurrentStoryData() as
        | { initialGlobals?: Record<string, unknown> }
        | undefined;
      const initialGlobals =
        data.initialGlobals || currentStoryData?.initialGlobals || {};

      const changedGlobals = Object.keys(data.globals).reduce((obj, key) => {
        const globalValue = data.globals?.[key];

        if (globalValue !== undefined && !equal(globalValue, initialGlobals[key])) {
          obj[key] = globalValue;
        }

        return obj;
      }, {} as ScreenshotProp);

      setGlobals(getScreenshotProp(changedGlobals));
    };

    const storyChange = () => {
      setGlobals(undefined);
    };

    channel.on(GLOBALS_UPDATED, setGlobalStore);
    channel.on(STORY_CHANGED, storyChange);

    return () => {
      channel.off(GLOBALS_UPDATED, setGlobalStore);
      channel.off(STORY_CHANGED, storyChange);
    };
  }, []);

  return globals;
}
