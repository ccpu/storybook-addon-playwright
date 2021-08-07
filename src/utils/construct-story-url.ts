import { ScreenshotProp } from '../typings';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const normalize = require('normalize-url');
import { knobsToQuerystring } from './knobs-to-querystring';
import { parse } from 'url';
import { resolve } from 'path';
import ip from 'ip';

export const constructStoryUrl = (
  endpoint: string,
  id: string,
  props?: ScreenshotProp,
) => {
  const parsedEndpoint = parse(endpoint);

  const normalized =
    parsedEndpoint.hostname || ip.isV4Format(endpoint)
      ? normalize(endpoint)
      : 'file:///' + resolve(endpoint);

  let storyUrl = `${normalized}/iframe.html?id=${id}`;

  if (props) {
    storyUrl = `${storyUrl}&${knobsToQuerystring(props)}`;
  }

  return storyUrl.replace(/\\/g, '/');
};
