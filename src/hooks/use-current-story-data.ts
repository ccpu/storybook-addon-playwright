import { useState, useEffect } from 'react';
import { useStorybookApi, useStorybookState } from '@storybook/api';
import { StoryInput } from '../typings';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryInput>();

  const api = useStorybookApi();

  const state = useStorybookState();

  useEffect(() => {
    const data = (api.getData(state.storyId) as unknown) as StoryInput;
    setData(data);
  }, [api, state]);

  return { storyData };
};
