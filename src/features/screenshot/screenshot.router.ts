import { z } from 'zod';
import { router, baseProcedure } from '../../trpc/trpc';
import {
  makeScreenshot,
  saveScreenshot,
  deleteScreenshot,
  updateScreenshot,
  testScreenshot,
  getStoryScreenshots,
  deleteStoryScreenshots,
  changeScreenshotIndex,
  testStoryScreenshots,
  testScreenshots,
} from './screenshot.service';

export const screenshotRouter = router({
  changeScreenshotIndex: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => changeScreenshotIndex(input)),

  // mutation: deletes file from disk
  deleteScreenshot: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => deleteScreenshot(input)),

  deleteStoryScreenshots: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => deleteStoryScreenshots(input)),

  // mutation: reads FS as part of a stateful lookup — justified
  getStoryScreenshots: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => getStoryScreenshots(input)),

  saveScreenshot: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => saveScreenshot(input)),

  // mutation: triggers browser + returns image buffer — has side effects
  takeScreenshot: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => makeScreenshot(input, true)),

  testScreenshot: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => testScreenshot(input)),

  testScreenshots: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => testScreenshots(input)),

  testStoryScreenshots: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => testStoryScreenshots(input)),

  updateScreenshot: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => updateScreenshot(input)),
});
