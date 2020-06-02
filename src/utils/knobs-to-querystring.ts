import { ScreenshotProp } from '../typings';

export const knobsToQuerystring = (props: ScreenshotProp[]) => {
  if (!props) return '';
  const propQuery = props.map((prop) => {
    return `knob-${prop.name}=${prop.value}`;
  });
  return propQuery.join('&');
};
