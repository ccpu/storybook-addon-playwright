import {
  changeScreenshotIndexInputSchema,
  deleteScreenshotInputSchema,
  deleteStoryScreenshotsInputSchema,
  imageDiffResultOutputSchema,
  saveScreenshotInputSchema,
  saveScreenshotOutputSchema,
  storyInputSchema,
  takeScreenshotInputSchema,
  testScreenshotInputSchema,
  testScreenshotsInputSchema,
  testStoryScreenshotsInputSchema,
  updateScreenshotInputSchema,
} from '../../../schema';
import { changeScreenshotIndex } from '../../services/change-screenshot-index';
import { deleteScreenshot } from '../../services/delete-screenshot';
import { deleteStoryScreenshots } from '../../services/delete-story-screenshots';
import { getStoryScreenshotsData as getStoryScreenshots } from '../../services/get-story-screenshots-data';
import { makeScreenshot } from '../../services/make-screenshot';
import { saveScreenshot } from '../../services/save-screenshot';
import { testScreenshotService as testScreenshot } from '../../services/test-screenshot-service';
import { testScreenshots } from '../../services/test-screenshots-service';
import { testStoryScreenshots } from '../../services/test-story-screenshots';
import { updateScreenshotService as updateScreenshot } from '../../services/update-screenshot-service';
import { baseProcedure, router } from '../trpc';

export const screenshotRouter = router({
  changeScreenshotIndex: baseProcedure
    .input(changeScreenshotIndexInputSchema)
    .mutation(async ({ input }) => changeScreenshotIndex(input)),

  // mutation: deletes file from disk
  deleteScreenshot: baseProcedure
    .input(deleteScreenshotInputSchema)
    .mutation(async ({ input }) => deleteScreenshot(input)),

  deleteStoryScreenshots: baseProcedure
    .input(deleteStoryScreenshotsInputSchema)
    .mutation(async ({ input }) => deleteStoryScreenshots(input)),

  // mutation: reads FS as part of a stateful lookup — justified
  getStoryScreenshots: baseProcedure
    .input(storyInputSchema)
    .mutation(async ({ input }) => getStoryScreenshots(input)),

  saveScreenshot: baseProcedure
    .input(saveScreenshotInputSchema)
    .output(saveScreenshotOutputSchema)
    .mutation(async ({ input }) => saveScreenshot(input)),

  // mutation: triggers browser + returns image buffer — has side effects
  takeScreenshot: baseProcedure
    .input(takeScreenshotInputSchema)
    .mutation(async ({ input }) => makeScreenshot(input, true)),

  testScreenshot: baseProcedure
    .input(testScreenshotInputSchema)
    .output(imageDiffResultOutputSchema)
    .mutation(async ({ input }) => testScreenshot(input)),

  testScreenshots: baseProcedure
    .input(testScreenshotsInputSchema)
    .output(imageDiffResultOutputSchema.array())
    .mutation(async ({ input }) => testScreenshots(input)),

  testStoryScreenshots: baseProcedure
    .input(testStoryScreenshotsInputSchema)
    .output(imageDiffResultOutputSchema.array())
    .mutation(async ({ input }) => testStoryScreenshots(input)),

  updateScreenshot: baseProcedure
    .input(updateScreenshotInputSchema)
    .mutation(async ({ input }) => updateScreenshot(input)),
});
