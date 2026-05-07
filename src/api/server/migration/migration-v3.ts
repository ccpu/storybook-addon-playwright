import type { PlaywrightData } from '../../../typings';

export function migrationV3(data: PlaywrightData, version: string) {
  data.version = version;
  return data;
}
