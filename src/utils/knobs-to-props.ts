import { KnobStoreKnob } from '../typings';

type Props = { [key: string]: unknown };

export const knobsToProps = (knobs: KnobStoreKnob): Props[] => {
  const props = Object.keys(knobs).reduce((arr, key) => {
    const knob = knobs[key];
    arr.push({
      [key]: knob.value,
    });
    return arr;
  }, [] as Props[]);

  return props;
};
