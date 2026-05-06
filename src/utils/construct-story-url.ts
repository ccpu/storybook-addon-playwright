import { ScreenshotProp } from '../typings';

import normalize from 'normalize-url';
import { argsToQuerystring } from './args-to-querystring';
import { knobsToQuerystring } from './knobs-to-querystring';

export const constructStoryUrl = (
  endpoint: string,
  id: string,
  props?: ScreenshotProp,
  args?: ScreenshotProp,
) => {
  let normalized: string;

  if (/^\.{0,2}[/\\]/.test(endpoint)) {
    // File-system path (./storybook-static, /abs/path, ../rel/path)
    normalized = 'file:///' + endpoint.replace(/\\/g, '/').replace(/^\/+/, '');
  } else if (/^https?:\/\//i.test(endpoint) || /^file:\/\//i.test(endpoint)) {
    // Already has explicit protocol
    normalized = normalize(endpoint);
  } else {
    // Bare hostname:port, IPv4, or plain hostname (e.g. localhost:9002)
    // Prepend http:// so normalize preserves it instead of defaulting to https://
    normalized = normalize('http://' + endpoint);
  }

  let storyUrl = `${normalized}/iframe.html?id=${id}`;

  if (args) {
    const argsQuery = argsToQuerystring(args);
    if (argsQuery) {
      storyUrl = `${storyUrl}&args=${argsQuery}`;
    }
  }

  if (props) {
    const propsQuery = knobsToQuerystring(props);
    if (propsQuery) {
      storyUrl = `${storyUrl}&${propsQuery}`;
    }
  }

  return storyUrl.replace(/\\/g, '/');
};
