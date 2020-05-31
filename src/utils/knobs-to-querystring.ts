import { KnobStoreKnob } from '../typings';

export const knobsToQuerystring = (knobs: KnobStoreKnob[]) => {
  if (!knobs) return '';
  const knobQuery = knobs.map((knob) => {
    return `knob-${knob.name}=${knob.value}`;
  });
  return knobQuery.join('&');
};
