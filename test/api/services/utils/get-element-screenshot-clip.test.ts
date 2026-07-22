import { getElementScreenshotClip } from '../../../../src/api/services/utils/get-element-screenshot-clip';

describe('getElementScreenshotClip', () => {
  it('should be defined', () => {
    expect(getElementScreenshotClip).toBeDefined();
  });

  it('should inset the bounding box by the offset on every side', () => {
    expect(getElementScreenshotClip({ x: 10, y: 20, width: 100, height: 50 }, 5)).toEqual(
      { x: 15, y: 25, width: 90, height: 40 },
    );
  });

  it('should expand the bounding box outward for a negative offset', () => {
    expect(
      getElementScreenshotClip({ x: 10, y: 20, width: 100, height: 50 }, -5),
    ).toEqual({ x: 5, y: 15, width: 110, height: 60 });
  });

  it('should throw when the offset removes the whole width', () => {
    expect(() =>
      getElementScreenshotClip({ x: 0, y: 0, width: 20, height: 100 }, 10),
    ).toThrowError(/offset \(10\) is too large/);
  });

  it('should throw when the offset removes the whole height', () => {
    expect(() =>
      getElementScreenshotClip({ x: 0, y: 0, width: 100, height: 20 }, 10),
    ).toThrowError(/offset \(10\) is too large/);
  });
});
