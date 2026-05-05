import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { changeScreenshotIndex } from '../store/index';

export interface SortableIndexChangeEvent {
  newIndex: number;
  oldIndex: number;
}

export const useScreenshotIndexChange = () => {
  const { mutateAsync, isPending: ChangeIndexInProgress } =
    trpcClient.screenshot.changeScreenshotIndex.useMutation();

  const storyData = useCurrentStoryData();

  const changeIndex = useCallback(
    async (e: SortableIndexChangeEvent) => {
      if (!storyData) return;

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
