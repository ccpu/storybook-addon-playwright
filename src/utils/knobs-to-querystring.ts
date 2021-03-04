import { ScreenshotProp } from '../typings';

export const knobsToQuerystring = (props?: ScreenshotProp) => {
  if (!props) return '';

  const keys = Object.keys(props);

  const propQuery = keys.map((prop) => {
    const propVal = props[prop];
    if (Array.isArray(propVal)) {
        if(propVal.length>0&& typeof propVal[0]==='object')
        {
            return `knob-${prop}=${JSON.stringify(propVal)}`;
        }else{
            return `knob-${prop}=${propVal.join(',')}`;
        }
    }
    if (typeof propVal === 'object') {
        return `knob-${prop}=${JSON.stringify(propVal)}`;
    }
    return `knob-${prop}=${propVal}`;
  });
  return encodeURI(propQuery.join('&'));
};
