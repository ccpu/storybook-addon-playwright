import { ActionSchema } from '../typings';
import { get } from 'object-path-immutable';

export const getActionSchema = (
  def: ActionSchema,
  key: string,
): ActionSchema | undefined => {
  if (!key) return undefined;
  const extendedKey = key.split('.').join('.properties.');
  const schema = get(def, extendedKey);
  return schema;
};
