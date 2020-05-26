// import { ImageDiff } from '../../typings';
// import { StoryInfo } from '../../../typings';
// import { getScreenshotData } from './utils';
// import { diffImageToScreenshot } from './diff-image-to-screenshot';
// import { makeScreenshot } from './make-screenshot';
// import { getStoryFileInfo, loadStoryData } from '../utils';

// export const testStoryScreenshot = async (
//   data: StoryInfo,
//   host: string,
// ): Promise<ImageDiff> => {
//   const fileInfo = getStoryFileInfo(data.fileName);
//   const storyData = await loadStoryData(fileInfo);

//   if (
//     !storyData ||
//     !storyData[data.storyId] ||
//     !storyData[data.storyId].screenshots
//   ) {
//     throw new Error('Unable to find story screenshots');
//   }

//   const screenshotData = await getScreenshotData({});

//   if (!screenshotData) {
//     throw new Error('Unable to find screenshot data.');
//   }

//   const snapshotData = await makeScreenshot(
//     {
//       actions: screenshotData.actions,
//       browserType: screenshotData.browserType,
//       device: screenshotData.device,
//       knobs: screenshotData.knobs,
//       storyId: data.storyId,
//     },
//     host,
//     false,
//   );

//   const result = diffImageToScreenshot(
//     {
//       browserType: screenshotData.browserType,
//       fileName: data.fileName,
//       storyId: data.storyId,
//       title: screenshotData.title,
//     },
//     snapshotData.buffer,
//   );

//   return result;
// };
