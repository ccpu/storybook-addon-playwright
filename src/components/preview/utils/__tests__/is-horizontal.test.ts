import { isHorizontalPanel } from '../is-horizontal';
import { AddonState } from '../../../../typings';

describe('isHorizontalPanel', () => {
  it('should be false if placement prop of  AddonState not set', () => {
    expect(isHorizontalPanel({} as AddonState, 'bottom')).toBe(false);
  });

  it('should be true', () => {
    expect(
      isHorizontalPanel({ placement: 'bottom' } as AddonState, 'bottom'),
    ).toBe(true);
  });

  it('should return false placement is defined but the value is not bottom', () => {
    expect(
      isHorizontalPanel({ placement: 'right' } as AddonState, 'bottom'),
    ).toBe(false);
  });

  it('should use storybookPanelPosition if addon state placement prop set to auto', () => {
    expect(
      isHorizontalPanel({ placement: 'auto' } as AddonState, 'bottom'),
    ).toBe(false);

    expect(
      isHorizontalPanel({ placement: 'auto' } as AddonState, 'right'),
    ).toBe(true);
  });
});
