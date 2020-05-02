import { ActionSchema } from '../typings';
import { get } from 'object-path-immutable';
import { Definition } from 'ts-to-json';

export const getActionSchema = (
  def: Definition,
  key: string,
): ActionSchema | undefined => {
  const extendedKey = key.split('.').join('.properties.');
  const schema = get(def, extendedKey);
  return schema;
};
