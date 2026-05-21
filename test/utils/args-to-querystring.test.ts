import { argsToQuerystring } from '../../src/utils/args-to-querystring';

describe('argsToQuerystring', () => {
  it('should return nothing for empty args', () => {
    expect(argsToQuerystring()).toBe('');
  });

  it('should serialize simple args', () => {
    expect(argsToQuerystring({ prop1: 'val' })).toBe('prop1:val');
  });

  it('should serialize booleans', () => {
    expect(argsToQuerystring({ prop1: true })).toBe('prop1:!true');
  });

  it('should keep safe nested leaves even when siblings are unsafe', () => {
    expect(
      argsToQuerystring({
        data: {
          nested: {
            footer: 'Footer changed via control 3',
            themeNote: 'Visible only when global theme is dark.',
          },
          title: 'Nested custom args data',
        },
      }),
    ).toBe(
      'data.nested.footer:Footer+changed+via+control+3;data.title:Nested+custom+args+data',
    );
  });

  it('should return empty string when all values are unsafe', () => {
    expect(
      argsToQuerystring({
        data: {
          note: 'Contains punctuation!',
        },
      }),
    ).toBe('');
  });
});
