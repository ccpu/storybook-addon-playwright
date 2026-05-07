import type { ActionSchema } from '../typings';
import { get } from 'object-path-immutable';

export function getActionSchema(
  schema: ActionSchema,
  key: string,
): ActionSchema | undefined {
  if (!key) return undefined;

  const extendedKey = key.split('.').join('.properties.');
  const actionSchema = get(schema, extendedKey);
  return actionSchema;
}
