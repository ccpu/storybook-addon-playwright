import { KnobStoreKnob } from '../typings';
import normalize from 'normalize-url';

export const constructUrl = (
  endpoint: string,
  id: string,
  knobs?: KnobStoreKnob[],
) => {
  let storyUrl = `${endpoint}/iframe.html?id=${id}`;

  if (knobs) {
    const knobQuery = knobs.map((knob) => {
      return `knob-${knob.name}=${knob.value}`;
    });
    storyUrl = `${storyUrl}&${knobQuery.join('&')}`;
  }

  const normalized = normalize(storyUrl);

  return normalized;
};
