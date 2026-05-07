import { getConfigs } from '../server/configs';

export function getThemeData() {
  return getConfigs().theme ?? null;
}
