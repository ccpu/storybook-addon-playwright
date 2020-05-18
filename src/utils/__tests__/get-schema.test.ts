import { getActionSchema } from '../get-schema';
import { getActionSchemaData } from '../../../__test_data__';

describe('getActionSchema', () => {
  it('should return nothing', () => {
    expect(getActionSchema(getActionSchemaData(), '')).not.toBeDefined();
  });

  it('should return nothing if invalid path given', () => {
    expect(
      getActionSchema(getActionSchemaData(), 'invalid-key'),
    ).not.toBeDefined();
  });

  it('should return action', () => {
    expect(getActionSchema(getActionSchemaData(), 'click')).toBeDefined();
  });

  it('should return nested action', () => {
    expect(getActionSchema(getActionSchemaData(), 'mouse.click')).toBeDefined();
  });
});
