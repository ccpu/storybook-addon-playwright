import { releaseModifierKey } from '../release-modifier-Key';
import { Page } from 'playwright';

describe('releaseModifierKey', () => {
  it('should be defined', () => {
    expect(releaseModifierKey).toBeDefined();
  });

  it('should release modifier key', () => {
    const keyboardUpMock = jest.fn();

    releaseModifierKey(
      ({ keyboard: { up: keyboardUpMock } } as unknown) as Page,
      [
        {
          actions: [
            {
              args: { key: 'Control' },
              id: 'action-id',
              name: 'keyboard.down',
            },
          ],
          id: 'id',
          title: 'keyup',
        },
      ],
    );
    expect(keyboardUpMock).toHaveBeenCalledTimes(1);
  });

  it('should do nothing for keys other than modifier key', () => {
    const keyboardUpMock = jest.fn();

    releaseModifierKey(
      ({ keyboard: { up: keyboardUpMock } } as unknown) as Page,
      [
        {
          actions: [
            {
              args: { key: 'A' },
              id: 'action-id',
              name: 'keyboard.down',
            },
          ],
          id: 'id',
          title: 'keyup',
        },
      ],
    );
    expect(keyboardUpMock).toHaveBeenCalledTimes(0);
  });
});
