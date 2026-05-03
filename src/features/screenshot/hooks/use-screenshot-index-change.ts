import { useCallback } from 'react';
import { SortEnd } from 'react-sortable-hoc';
import { trpcClient } from '../../../api';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { changeScreenshotIndex } from '../store/index';

export const useScreenshotIndexChange = () => {
  const { mutateAsync, isPending: ChangeIndexInProgress } =
    trpcClient.screenshot.changeScreenshotIndex.useMutation();

  const storyData = useCurrentStoryData();

  const changeIndex = useCallback(
    async (e: SortEnd) => {
      changeScreenshotIndex({ newIndex: e.newIndex, oldIndex: e.oldIndex });
      try {
        await mutateAsync({
          filePath: storyData.filePath,
          newIndex: e.newIndex,
          oldIndex: e.oldIndex,
          storyId: storyData.id,
        });
      } catch {
        changeScreenshotIndex({ newIndex: e.oldIndex, oldIndex: e.newIndex });
      }
    },
    [mutateAsync, storyData],
  );
  return {
    ChangeIndexInProgress,
    changeIndex,
  };
};
