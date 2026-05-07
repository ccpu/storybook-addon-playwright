import type { PlaywrightData } from '../../../typings';

export function migrationV4(data: PlaywrightData, version: string) {
  data.version = version;
  return data;
}
