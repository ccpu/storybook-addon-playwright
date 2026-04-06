import { getBorderColor } from '../../../../../../src/features/screenshot/components/screenshot-preview/utils/get-border-color';

describe('getBorderColor', () => {
  it('should return lighter', () => {
    expect(getBorderColor('dark', '#000', 0.5)).toBe('rgb(127, 127, 127)');
  });
  it('should return darker', () => {
    expect(getBorderColor('light', '#fff', 0.5)).toBe('rgb(127, 127, 127)');
  });
});
