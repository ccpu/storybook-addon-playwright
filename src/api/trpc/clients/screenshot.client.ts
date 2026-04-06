import type { RouterInput, RouterOutput } from '../router';
import { trpc } from '../client';

export const getScreenshot = (
  input: RouterInput['screenshot']['takeScreenshot'],
): Promise<RouterOutput['screenshot']['takeScreenshot']> =>
  trpc.screenshot.takeScreenshot.mutate(input);

export const saveScreenshot = (
  input: RouterInput['screenshot']['saveScreenshot'],
): Promise<RouterOutput['screenshot']['saveScreenshot']> =>
  trpc.screenshot.saveScreenshot.mutate(input);

export const deleteScreenshot = (
  input: RouterInput['screenshot']['deleteScreenshot'],
): Promise<RouterOutput['screenshot']['deleteScreenshot']> =>
  trpc.screenshot.deleteScreenshot.mutate(input);

export const updateScreenshot = (
  input: RouterInput['screenshot']['updateScreenshot'],
): Promise<RouterOutput['screenshot']['updateScreenshot']> =>
  trpc.screenshot.updateScreenshot.mutate(input);

export const testScreenshot = (
  input: RouterInput['screenshot']['testScreenshot'],
): Promise<RouterOutput['screenshot']['testScreenshot']> =>
  trpc.screenshot.testScreenshot.mutate(input);

export const getStoryScreenshots = (
  input: RouterInput['screenshot']['getStoryScreenshots'],
): Promise<RouterOutput['screenshot']['getStoryScreenshots']> =>
  trpc.screenshot.getStoryScreenshots.mutate(input);

export const deleteStoryScreenshots = (
  input: RouterInput['screenshot']['deleteStoryScreenshots'],
): Promise<RouterOutput['screenshot']['deleteStoryScreenshots']> =>
  trpc.screenshot.deleteStoryScreenshots.mutate(input);

export const changeScreenShotIndex = (
  input: RouterInput['screenshot']['changeScreenshotIndex'],
): Promise<RouterOutput['screenshot']['changeScreenshotIndex']> =>
  trpc.screenshot.changeScreenshotIndex.mutate(input);

export const testStoryScreenshots = (
  input: RouterInput['screenshot']['testStoryScreenshots'],
): Promise<RouterOutput['screenshot']['testStoryScreenshots']> =>
  trpc.screenshot.testStoryScreenshots.mutate(input);

export const testScreenshots = (
  input: RouterInput['screenshot']['testScreenshots'],
): Promise<RouterOutput['screenshot']['testScreenshots']> =>
  trpc.screenshot.testScreenshots.mutate(input);
