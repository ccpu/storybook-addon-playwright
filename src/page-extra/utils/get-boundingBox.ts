import { Page } from 'playwright';
import { ElementHandleBoundingBox } from '../typings';

export const getBoundingBox = async (
  page: Page,
  selector: string,
): Promise<ElementHandleBoundingBox> => {
  await page.waitForSelector(selector);
  const elm = await page.$(selector);
  if (!elm) throw new Error('Unable to find selector!');
  const box = await elm.boundingBox();
  if (!box) throw new Error('Unable to get boundingBox!');
  return box;
};
