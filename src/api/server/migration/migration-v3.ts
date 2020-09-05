import { PlaywrightData } from '../../../typings';

export const migrationV3 = (data: PlaywrightData, version: string) => {
  data.version = version;
  return data;
};
