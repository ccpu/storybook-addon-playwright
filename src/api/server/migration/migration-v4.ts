import { PlaywrightData } from '../../../typings';

export const migrationV4 = (data: PlaywrightData, version: string) => {
  data.version = version;
  return data;
};
