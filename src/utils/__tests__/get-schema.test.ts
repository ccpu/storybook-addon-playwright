import { getActionSchema } from '../get-schema';
import { actionSchema } from './data/schema';

describe('getActionSchema', () => {
  it('should return nothing', () => {
    expect(getActionSchema(actionSchema, '')).not.toBeDefined();
  });

  it('should return nothing if invalid path given', () => {
    expect(getActionSchema(actionSchema, 'invalid-key')).not.toBeDefined();
  });

  it('should return action', () => {
    expect(getActionSchema(actionSchema, 'click')).toBeDefined();
  });

  it('should return nested action', () => {
    expect(getActionSchema(actionSchema, 'mouse.click')).toBeDefined();
  });
});
