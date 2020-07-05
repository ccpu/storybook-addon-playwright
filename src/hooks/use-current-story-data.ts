import { useState, useEffect } from 'react';
import { useStorybookApi } from '@storybook/api';
import { StoryData } from '../typings';
import { getStoryFilePath } from '../utils';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryData>({} as StoryData);

  const api = useStorybookApi();

  const currentStory = (api.getCurrentStoryData() as unknown) as StoryData;

  useEffect(() => {
    if (!currentStory) return;

    const data = currentStory;
    const fileName = getStoryFilePath(data.parameters.fileName, data.id);

    setData({
      ...data,
      parameters: { ...data.parameters, fileName: fileName },
    });
  }, [currentStory]);

  return storyData;
};
