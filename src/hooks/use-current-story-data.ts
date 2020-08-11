import { useState, useEffect } from 'react';
import { useStorybookApi } from '@storybook/api';
import { StoryData } from '../typings';
import { getStoryFilePath } from '../utils';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryData>();

  const api = useStorybookApi();

  const currentStory = (api.getCurrentStoryData() as unknown) as StoryData;

  useEffect(() => {
    if (!currentStory) return;
    const version = api.getCurrentVersion().version.split('.')[0];

    const data = currentStory;
    const fileName =
      +version > 5
        ? data.parameters.fileName
        : getStoryFilePath(data.parameters.fileName, data.id);

    setData({
      ...data,
      parameters: { ...data.parameters, fileName: fileName },
    });
  }, [api, currentStory]);

  return storyData;
};
