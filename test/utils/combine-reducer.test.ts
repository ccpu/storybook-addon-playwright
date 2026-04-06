import { combineReducers } from '../../src/utils/combine-reducer';

describe('combineReducers', () => {
  it('should return state', () => {
    const reducer1 = (state: unknown) => state;
    const reducer2 = (state: unknown) => state;
    expect(
      combineReducers(reducer1, reducer2)({ old: true }, {}),
    ).toStrictEqual({
      old: true,
    });
  });
});
