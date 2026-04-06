/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getBoundingBox } from '../../../src/page-extra/utils/get-boundingBox';
import { pagePropsMock } from '../../manual-mocks/playwright';

describe('getBoundingBox', () => {
  it('should throw error if selector not exist', async () => {
    await expect(
      // @ts-ignore
      getBoundingBox(pagePropsMock(), '#invalid-selector'),
    ).rejects.toThrowError('Unable to find selector!');
  });

  it('should return rect', async () => {
    await expect(
      // @ts-ignore
      getBoundingBox(pagePropsMock(), '#selector-null'),
    ).rejects.toThrowError('Unable to get boundingBox!');
  });

  it('should return bounding box', async () => {
    // @ts-ignore
    const box = await getBoundingBox(pagePropsMock(), '#selector');
    expect(box).toStrictEqual({ height: 100, width: 100, x: 0, y: 0 });
  });
});
