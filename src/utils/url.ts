import { KnobStore } from '../typings';
import normalize from 'normalize-url';

export const constructUrl = (
  endpoint: string,
  id: string,
  knobs?: KnobStore,
) => {
  let storyUrl = `${endpoint}/iframe.html?id=${id}`;

  if (knobs) {
    const knobQuery = Object.keys(knobs).map((k) => {
      const knob = knobs[k];
      return `knob-${k}=${knob.value}`;
    });
    storyUrl = `${storyUrl}&${knobQuery.join('&')}`;
  }

  const normalized = normalize(storyUrl);

  return normalized;
};
