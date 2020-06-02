import { ScreenshotProp } from '../typings';
import normalize from 'normalize-url';
import { knobsToQuerystring } from './knobs-to-querystring';

export const constructStoryUrl = (
  endpoint: string,
  id: string,
  knobs?: ScreenshotProp[],
) => {
  let storyUrl = `${endpoint}/iframe.html?id=${id}`;

  if (knobs) {
    storyUrl = `${storyUrl}&${knobsToQuerystring(knobs)}`;
  }

  const normalized = normalize(storyUrl);

  return normalized;
};
