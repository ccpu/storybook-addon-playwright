import { getConfigs } from '../server/configs';
import type { Theme } from '@material-ui/core';

export const getThemeData = () => {
  return (getConfigs().theme ?? null) as Theme | null;
};
