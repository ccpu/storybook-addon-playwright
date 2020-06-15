import { ScreenshotProp } from '../typings';
import normalize from 'normalize-url';
import { knobsToQuerystring } from './knobs-to-querystring';
import { parse } from 'url';
import { resolve } from 'path';

export const constructStoryUrl = (
  endpoint: string,
  id: string,
  knobs?: ScreenshotProp[],
) => {
  const normalized = parse(endpoint).hostname
    ? normalize(endpoint)
    : 'file:///' + resolve(endpoint);

  let storyUrl = `${normalized}/iframe.html?id=${id}`;

  if (knobs) {
    storyUrl = `${storyUrl}&${knobsToQuerystring(knobs)}`;
  }

  return storyUrl.replace(/\\/g, '/');
};
