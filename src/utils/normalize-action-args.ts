import type { ActionSchema } from '../typings';
import { isEmptyNormalizedValue, normalizeSchemaValue } from './normalize-schema-value';

type ActionArgs = Record<string, unknown>;

function getActionParameters(actionSchema?: ActionSchema): Record<string, ActionSchema> {
  const rawParameters =
    actionSchema && typeof actionSchema === 'object'
      ? (actionSchema as { parameters?: Record<string, ActionSchema> }).parameters
      : undefined;

  return rawParameters || {};
}

export function normalizeActionArgs(
  actionArgs: ActionArgs | undefined,
  actionSchema?: ActionSchema,
): ActionArgs | undefined {
  if (!actionArgs) {
    return undefined;
  }

  const parameters = getActionParameters(actionSchema);

  const normalizedArgs = Object.entries(actionArgs).reduce<ActionArgs>(
    (arr, [key, val]) => {
      const normalizedValue = normalizeSchemaValue(val, parameters[key]);

      if (!isEmptyNormalizedValue(normalizedValue)) {
        arr[key] = normalizedValue;
      }

      return arr;
    },
    {},
  );

  return Object.keys(normalizedArgs).length ? normalizedArgs : undefined;
}
