// Service functions re-exported from the existing service layer.
// Do not change service logic — only rename and relocate.

export { makeScreenshot } from '../../api/server/services/make-screenshot';
export { saveScreenshot } from '../../api/server/services/save-screenshot';
export { deleteScreenshot } from '../../api/server/services/delete-screenshot';
export { updateScreenshotService as updateScreenshot } from '../../api/server/services/update-screenshot-service';
export { testScreenshotService as testScreenshot } from '../../api/server/services/test-screenshot-service';
export { getStoryScreenshotsData as getStoryScreenshots } from '../../api/server/services/get-story-screenshots-data';
export { deleteStoryScreenshots } from '../../api/server/services/delete-story-screenshots';
export { changeScreenshotIndex } from '../../api/server/services/change-screenshot-index';
export { testStoryScreenshots } from '../../api/server/services/test-story-screenshots';
export { testScreenshots } from '../../api/server/services/test-screenshots-service';
