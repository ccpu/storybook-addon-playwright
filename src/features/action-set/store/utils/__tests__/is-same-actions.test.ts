import { isSameActions } from '../is-same-actions';

describe('isSameActions', () => {
  it('should be valid if same array', () => {
    const result = isSameActions(
      [{ name: 'name' }, { name: 'name-2' }],
      [{ name: 'name' }, { name: 'name-2' }],
    );
    expect(result).toBeTruthy();
  });

  it('should not be valid if array length not same', () => {
    const result = isSameActions(
      [{ name: 'name' }],
      [{ name: 'name' }, { name: 'name' }],
    );
    expect(result).toBeFalsy();
  });

  it('should not be valid if different value', () => {
    const result = isSameActions([{ name: 'name' }], [{ name: 'name2' }]);
    expect(result).toBeFalsy();
  });

  it('should be valid if have same object', () => {
    const result = isSameActions(
      [{ args: { selector: 'html' } }],
      [{ args: { selector: 'html' } }],
    );
    expect(result).toBeTruthy();
  });

  it('should not be valid if have no same object', () => {
    const result = isSameActions(
      [{ args: { selector: 'html' } }],
      [{ args: { selector: 'html?div' } }],
    );
    expect(result).toBeFalsy();
  });
});
