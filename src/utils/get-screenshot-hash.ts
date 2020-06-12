import sum from 'hash-sum';
import {
  StoryAction,
  ScreenshotProp,
  BrowserTypes,
  DeviceDescriptor,
  ScreenshotOptions,
} from '../typings';

interface ScreenshotHash {
  storyId: string;
  actions: StoryAction[];
  props: ScreenshotProp[];
  browserType: BrowserTypes;
  device: DeviceDescriptor;
  options: ScreenshotOptions;
}
export const getScreenshotHash: (options: ScreenshotHash) => string = (
  props,
) => {
  const { actions, browserType, device, options, storyId } = props;

  return sum({
    actions,
    browserType,
    device,
    options,
    props,
    storyId,
  });
};
