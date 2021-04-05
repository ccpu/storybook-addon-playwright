import { useState, useEffect } from 'react';
import { useStorybookApi } from '@storybook/api';
import { StoryData } from '../typings';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryData>();

  const api = useStorybookApi();

  const currentStory = (api.getCurrentStoryData() as unknown) as StoryData;

  useEffect(() => {
    if (!currentStory) return;

    const data = currentStory;
    const fileName = data.parameters.fileName;

    setData({
      ...data,
      parameters: { ...data.parameters, fileName: fileName },
    });
  }, [currentStory]);

  return storyData;
};
