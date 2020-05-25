import sum from 'hash-sum';
import {
  StoryAction,
  KnobStore,
  BrowserTypes,
  DeviceDescriptor,
} from '../typings';

export const getSnapshotHash = (
  storyId: string,
  actions: StoryAction[],
  knobs: KnobStore,
  browserType: BrowserTypes,
  deviceDescriptor: DeviceDescriptor,
) => {
  const knobsKeyValue =
    knobs &&
    Object.keys(knobs).map((key) => {
      return {
        key,
        value: knobs[key].value,
      };
    });

  return sum({
    actions,
    browserType,
    deviceDescriptor,
    knobsKeyValue,
    storyId,
  });
};
