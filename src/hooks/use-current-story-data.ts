import { useState, useEffect } from 'react';
import { useStorybookApi } from '@storybook/manager-api';
import { StoryData } from '../schema';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryData>();

  const api = useStorybookApi();

  const currentStory = api.getCurrentStoryData();

  useEffect(() => {
    if (!currentStory || !currentStory.importPath) return;
    const data = currentStory;
    const filePath = data.importPath;
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    setData({
      id: data.id,
      importPath: data.importPath,
      name: data.name,
      parameters: { ...data.parameters, fileName: fileName },
      parent: data.parent,
    });
  }, [currentStory]);

  return storyData;
};
