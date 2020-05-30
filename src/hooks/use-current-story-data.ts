import { useState, useEffect } from 'react';
import { useStorybookApi, useStorybookState } from '@storybook/api';
import { StoryData } from '../typings';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryData>();

  const api = useStorybookApi();

  const state = useStorybookState();

  useEffect(() => {
    const data = (api.getData(state.storyId) as unknown) as StoryData;
    setData(data);
  }, [api, state]);

  return storyData;
};
