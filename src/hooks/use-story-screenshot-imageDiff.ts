// import { useCallback } from 'react';
// import { useAsyncApiCall } from './use-async-api-call';
// import { testStoryScreenshots } from '../api/client';
// import { StoryData, ScreenshotTestType } from '../typings';
// import { nanoid } from 'nanoid';
// import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
// import {useScreenshotImageDiffResults} from './use-screenshot-imageDiff-results';

// export const useStoryScreenshotImageDiff = () => {
//   const { dispatch } = useGlobalScreenshotDispatch();

//   const {clearImageDiffError,storyImageDiffError,imageDiffTestInProgress,testStoryScreenShots} = useScreenshotImageDiffResults();

//   // const {
//   //   inProgress: imageDiffTestInProgress,
//   //   makeCall,
//   //   clearError: clearImageDiffError,
//   //   error: storyImageDiffError,
//   // } = useAsyncApiCall(useScreenshotImageDiffResults, false);

//   const testStoryScreenShots = useCallback(async (testType:ScreenshotTestType) => {
//     const results = await makeCall(testType);
//     if (!(results instanceof Error)) {
//       if (results) {
//         results.forEach((result) => {
//           dispatch({
//             imageDiffResult: result,
//             type: 'addImageDiffResult',
//           });
//         });
//       }
//     }
//     return results;
//   }, [dispatch, makeCall, storyData]);

//   return {
//     clearImageDiffError,
//     imageDiffTestInProgress,
//     storyImageDiffError,
//     testStoryScreenShots,
//   };
// };
