import { z } from 'zod';

import { actionSetSchema } from './action-set';
import { createStoryInputSchema } from './story';
import { BrowserContextOptions, ScreenshotOptions } from '../typings';

const looseObjectSchema = z.record(z.string(), z.unknown());

export const browserTypeSchema = z.enum(['chromium', 'firefox', 'webkit']);

export const screenshotTestTargetTypeSchema = z.enum([
  'file',
  'story',
  'all',
  'story-screenshot',
]);

export const requestDataSchema = z.object({
  requestId: z.string().optional(),
  requestType: screenshotTestTargetTypeSchema.optional(),
});

export const browserOptionsSchema = z.custom<BrowserContextOptions>(
  (value) => value === undefined || typeof value === 'object',
);

export const screenshotOptionsSchema = z.custom<ScreenshotOptions>(
  (value) => value === undefined || typeof value === 'object',
);

export const screenshotSettingSchema = z.object({
  actionSets: z.array(actionSetSchema).optional(),
  browserOptions: browserOptionsSchema.optional(),
  browserOptionsId: z.string().optional(),
  browserType: browserTypeSchema,
  props: looseObjectSchema.optional(),
  screenshotOptions: screenshotOptionsSchema.optional(),
  screenshotOptionsId: z.string().optional(),
});

export const screenshotDataSchema = screenshotSettingSchema.extend({
  id: z.string(),
  index: z.number().int().nonnegative().optional(),
  title: z.string(),
});

export const screenshotInfoSchema = createStoryInputSchema({
  screenshotId: z.string(),
});

export const changeScreenshotIndexInputSchema = createStoryInputSchema({
  newIndex: z.number().int().nonnegative(),
  oldIndex: z.number().int().nonnegative(),
});

export const deleteScreenshotInputSchema = screenshotInfoSchema;

export const deleteStoryScreenshotsInputSchema = createStoryInputSchema({});

export const saveScreenshotInputSchema = createStoryInputSchema({
  ...screenshotDataSchema.shape,
  base64: z.string().optional(),
  updateScreenshot: screenshotDataSchema.omit({ actionSets: true }).optional(),
});

export const takeScreenshotInputSchema = screenshotSettingSchema
  .extend(requestDataSchema.shape)
  .extend({
    storyId: z.string(),
  });

export const testScreenshotInputSchema = createStoryInputSchema({
  ...requestDataSchema.shape,
  screenshotId: z.string(),
});

export const testStoryScreenshotsInputSchema = createStoryInputSchema({
  ...requestDataSchema.shape,
});

export const testScreenshotsInputSchema = createStoryInputSchema({
  ...requestDataSchema.shape,
  requestType: screenshotTestTargetTypeSchema,
});

export const updateScreenshotInputSchema = createStoryInputSchema({
  base64: z.string().optional(),
  screenshotId: z.string(),
});

export type RequestDataInput = z.infer<typeof requestDataSchema>;
export type ScreenshotSettingInput = z.infer<typeof screenshotSettingSchema>;
export type ScreenshotDataInput = z.infer<typeof screenshotDataSchema>;
export type ScreenshotInfoInput = z.infer<typeof screenshotInfoSchema>;
export type ChangeScreenshotIndexInput = z.infer<
  typeof changeScreenshotIndexInputSchema
>;
export type DeleteScreenshotInput = z.infer<typeof deleteScreenshotInputSchema>;
export type DeleteStoryScreenshotsInput = z.infer<
  typeof deleteStoryScreenshotsInputSchema
>;
export type SaveScreenshotInput = z.infer<typeof saveScreenshotInputSchema>;
export type TakeScreenshotInput = z.infer<typeof takeScreenshotInputSchema>;
export type TestScreenshotInput = z.infer<typeof testScreenshotInputSchema>;
export type TestStoryScreenshotsInput = z.infer<
  typeof testStoryScreenshotsInputSchema
>;
export type TestScreenshotsInput = z.infer<typeof testScreenshotsInputSchema>;
export type UpdateScreenshotInput = z.infer<typeof updateScreenshotInputSchema>;
