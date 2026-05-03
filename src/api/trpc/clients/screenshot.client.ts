import type { RouterInput, RouterOutput } from '../router';
import { createTrpcHttpClient } from '../client';

const client = createTrpcHttpClient();

export const getScreenshot = (
  input: RouterInput['screenshot']['takeScreenshot'],
): Promise<RouterOutput['screenshot']['takeScreenshot']> =>
  client.screenshot.takeScreenshot.mutate(input);

export const saveScreenshot = (
  input: RouterInput['screenshot']['saveScreenshot'],
): Promise<RouterOutput['screenshot']['saveScreenshot']> =>
  client.screenshot.saveScreenshot.mutate(input);

export const deleteScreenshot = (
  input: RouterInput['screenshot']['deleteScreenshot'],
): Promise<RouterOutput['screenshot']['deleteScreenshot']> =>
  client.screenshot.deleteScreenshot.mutate(input);

export const updateScreenshot = (
  input: RouterInput['screenshot']['updateScreenshot'],
): Promise<RouterOutput['screenshot']['updateScreenshot']> =>
  client.screenshot.updateScreenshot.mutate(input);

export const testScreenshot = (
  input: RouterInput['screenshot']['testScreenshot'],
): Promise<RouterOutput['screenshot']['testScreenshot']> =>
  client.screenshot.testScreenshot.mutate(input);

export const getStoryScreenshots = (
  input: RouterInput['screenshot']['getStoryScreenshots'],
): Promise<RouterOutput['screenshot']['getStoryScreenshots']> =>
  client.screenshot.getStoryScreenshots.mutate(input);

export const deleteStoryScreenshots = (
  input: RouterInput['screenshot']['deleteStoryScreenshots'],
): Promise<RouterOutput['screenshot']['deleteStoryScreenshots']> =>
  client.screenshot.deleteStoryScreenshots.mutate(input);

export const changeScreenShotIndex = (
  input: RouterInput['screenshot']['changeScreenshotIndex'],
): Promise<RouterOutput['screenshot']['changeScreenshotIndex']> =>
  client.screenshot.changeScreenshotIndex.mutate(input);

export const testStoryScreenshots = (
  input: RouterInput['screenshot']['testStoryScreenshots'],
): Promise<RouterOutput['screenshot']['testStoryScreenshots']> =>
  client.screenshot.testStoryScreenshots.mutate(input);

export const testScreenshots = (
  input: RouterInput['screenshot']['testScreenshots'],
): Promise<RouterOutput['screenshot']['testScreenshots']> =>
  client.screenshot.testScreenshots.mutate(input);
