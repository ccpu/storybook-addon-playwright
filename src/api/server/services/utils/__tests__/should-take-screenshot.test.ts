import { shouldTakeScreenshot } from '../should-take-screenshot';

describe('shouldTakeScreenshot', () => {
  it('should be defined', () => {
    expect(shouldTakeScreenshot).toBeDefined();
  });

  it('should take screenshot', () => {
    expect(
      shouldTakeScreenshot(
        [
          { id: 'id', name: 'click' },
          { id: 'id', name: 'hover' },
        ],
        0,
        true,
      ),
    ).toBeTruthy();
  });

  it('should not take screenshot for last item', () => {
    expect(
      shouldTakeScreenshot(
        [
          { id: 'id', name: 'click' },
          { id: 'id', name: 'hover' },
        ],
        1,
        true,
      ),
    ).toBeFalsy();
  });

  it('should not take screenshot when not enabled', () => {
    expect(
      shouldTakeScreenshot(
        [
          { id: 'id', name: 'click' },
          { id: 'id', name: 'hover' },
        ],
        1,
        false,
      ),
    ).toBeFalsy();
  });

  it('should not take screenshot if only 1 action available', () => {
    expect(
      shouldTakeScreenshot([{ id: 'id', name: 'click' }], 0, true),
    ).toBeFalsy();
  });

  it('should not take screenshot for specified properties', () => {
    expect(
      shouldTakeScreenshot(
        [
          { id: 'id', name: 'takeScreenshot' },
          { id: 'id', name: 'takeScreenshot' },
        ],
        1,
        true,
      ),
    ).toBeFalsy();
  });

  it('should not take screenshot if next action is waitForTimeout or waitForSelector', () => {
    expect(
      shouldTakeScreenshot(
        [
          { id: 'id', name: 'click' },
          { id: 'id', name: 'waitForTimeout' },
        ],
        0,
        true,
      ),
    ).toBeFalsy();

    expect(
      shouldTakeScreenshot(
        [
          { id: 'id', name: 'click' },
          { id: 'id', name: 'waitForSelector' },
        ],
        0,
        true,
      ),
    ).toBeFalsy();
  });
});
