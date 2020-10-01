import { ScreenshotProp } from '../typings';

export const knobsToQuerystring = (props?: ScreenshotProp) => {
  if (!props) return '';

  const keys = Object.keys(props);

  const propQuery = keys.map((prop) => {
    if(Array.isArray(props[prop]))
    {
        return `knob-${prop}=${props[prop].join(',')}`;
    }

    if (typeof props[prop] === 'object') {
      return `knob-${prop}=${JSON.stringify(props[prop])}`;
    }

    return `knob-${prop}=${props[prop]}`;
  });
  return encodeURI(propQuery.join('&'));
};
