import { ScreenshotProp } from '../typings';

export const knobsToQuerystring = (props?: ScreenshotProp) => {
  if (!props) return '';

  const keys = Object.keys(props);

  const propQuery = keys.map((prop) => {
    return `knob-${prop}=${props[prop]}`;
  });
  return propQuery.join('&');
};
