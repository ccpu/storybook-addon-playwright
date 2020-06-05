import sum from 'hash-sum';
import {
  StoryAction,
  ScreenshotProp,
  BrowserTypes,
  DeviceDescriptor,
} from '../typings';

export const getScreenshotHash = (
  storyId: string,
  actions: StoryAction[],
  props: ScreenshotProp[],
  browserType: BrowserTypes,
  deviceDescriptor: DeviceDescriptor,
) => {
  return sum({
    actions,
    browserType,
    deviceDescriptor,
    props,
    storyId,
  });
};
