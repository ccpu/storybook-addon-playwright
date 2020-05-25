import sum from 'hash-sum';
import {
  StoryAction,
  KnobStoreKnob,
  BrowserTypes,
  DeviceDescriptor,
} from '../typings';

export const getSnapshotHash = (
  storyId: string,
  actions: StoryAction[],
  knobs: KnobStoreKnob[],
  browserType: BrowserTypes,
  deviceDescriptor: DeviceDescriptor,
) => {
  const knobsKeyValue =
    knobs &&
    knobs.map((knob) => {
      return {
        key: knob.name,
        value: knob.value,
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
