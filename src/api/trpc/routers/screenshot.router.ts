import { router, baseProcedure } from '../trpc';
import { makeScreenshot } from '../../services/make-screenshot';
import { saveScreenshot } from '../../services/save-screenshot';
import { deleteScreenshot } from '../../services/delete-screenshot';
import { updateScreenshotService as updateScreenshot } from '../../services/update-screenshot-service';
import { testScreenshotService as testScreenshot } from '../../services/test-screenshot-service';
import { getStoryScreenshotsData as getStoryScreenshots } from '../../services/get-story-screenshots-data';
import { deleteStoryScreenshots } from '../../services/delete-story-screenshots';
import { changeScreenshotIndex } from '../../services/change-screenshot-index';
import { testStoryScreenshots } from '../../services/test-story-screenshots';
import { testScreenshots } from '../../services/test-screenshots-service';
import {
  changeScreenshotIndexInputSchema,
  deleteScreenshotInputSchema,
  deleteStoryScreenshotsInputSchema,
  saveScreenshotInputSchema,
  storyInputSchema,
  takeScreenshotInputSchema,
  testScreenshotInputSchema,
  testScreenshotsInputSchema,
  testStoryScreenshotsInputSchema,
  updateScreenshotInputSchema,
} from '../../../schema';

export const screenshotRouter = router({
  changeScreenshotIndex: baseProcedure
    .input(changeScreenshotIndexInputSchema)
    .mutation(({ input }) => changeScreenshotIndex(input)),

  // mutation: deletes file from disk
  deleteScreenshot: baseProcedure
    .input(deleteScreenshotInputSchema)
    .mutation(({ input }) => deleteScreenshot(input)),

  deleteStoryScreenshots: baseProcedure
    .input(deleteStoryScreenshotsInputSchema)
    .mutation(({ input }) => deleteStoryScreenshots(input)),

  // mutation: reads FS as part of a stateful lookup — justified
  getStoryScreenshots: baseProcedure
    .input(storyInputSchema)
    .mutation(({ input }) => getStoryScreenshots(input)),

  saveScreenshot: baseProcedure
    .input(saveScreenshotInputSchema)
    .mutation(({ input }) => saveScreenshot(input)),

  // mutation: triggers browser + returns image buffer — has side effects
  takeScreenshot: baseProcedure
    .input(takeScreenshotInputSchema)
    .mutation(({ input }) => makeScreenshot(input, true)),

  testScreenshot: baseProcedure
    .input(testScreenshotInputSchema)
    .mutation(({ input }) => testScreenshot(input)),

  testScreenshots: baseProcedure
    .input(testScreenshotsInputSchema)
    .mutation(({ input }) => testScreenshots(input)),

  testStoryScreenshots: baseProcedure
    .input(testStoryScreenshotsInputSchema)
    .mutation(({ input }) => testStoryScreenshots(input)),

  updateScreenshot: baseProcedure
    .input(updateScreenshotInputSchema)
    .mutation(({ input }) => updateScreenshot(input)),
});
