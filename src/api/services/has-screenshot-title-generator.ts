import { getConfigs } from '../server/configs';

export function hasScreenshotTitleGenerator(): boolean {
  return typeof getConfigs().getScreenshotTitle === 'function';
}
