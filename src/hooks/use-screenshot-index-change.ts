import { useCallback } from 'react';
import { SortEnd } from 'react-sortable-hoc';
import { useAsyncApiCall } from './use-async-api-call';
import { changeScreenShotIndex } from '../api/client';
import { useCurrentStoryData } from './use-current-story-data';
import { useScreenshotDispatch } from '../store/screenshot';

export const useScreenshotIndexChange = () => {
  const {
    ErrorSnackbar: ChangeIndexErrorSnackbar,
    makeCall,
    inProgress: ChangeIndexInProgress,
  } = useAsyncApiCall(changeScreenShotIndex, false);

  const storyData = useCurrentStoryData();

  const dispatch = useScreenshotDispatch();

  const changeIndex = useCallback(
    async (e: SortEnd) => {
      dispatch({
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        type: 'changeIndex',
      });
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        storyId: storyData.id,
      });
      if (result instanceof Error) {
        dispatch({
          newIndex: e.oldIndex,
          oldIndex: e.newIndex,
          type: 'changeIndex',
        });
      }
    },
    [dispatch, makeCall, storyData],
  );
  return {
    ChangeIndexErrorSnackbar,
    ChangeIndexInProgress,
    changeIndex,
  };
};
