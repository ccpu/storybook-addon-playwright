import { ScreenshotProp } from '../typings';

export const knobsToQuerystring = (props?: ScreenshotProp) => {
  if (!props) return '';

  const keys = Object.keys(props);

  const propQuery = keys.map((prop) => {
    if (typeof props[prop] === 'object') {
      return `knob-${prop}=${JSON.stringify(props[prop])}`;
    }
    return `knob-${prop}=${props[prop]}`;
  });
  return propQuery.join('&');
};
