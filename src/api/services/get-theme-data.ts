import { getConfigs } from '../server/configs';

export const getThemeData = () => {
  return getConfigs().theme;
};
