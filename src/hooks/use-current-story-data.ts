import { useState, useEffect } from 'react';
import { useStorybookApi } from '@storybook/manager-api';
import { StoryData } from '../schema';

export const useCurrentStoryData = () => {
  const [storyData, setData] = useState<StoryData & { fileName: string }>();

  const api = useStorybookApi();

  const currentStory = api.getCurrentStoryData();

  useEffect(() => {
    if (!currentStory || !currentStory.importPath) return;
    const data = currentStory;
    const filePath = data.importPath;
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    setData({
      fileName,
      filePath,
      id: data.id,
      name: data.name,
      parent: data.parent,
    });
  }, [currentStory]);

  return storyData;
};
