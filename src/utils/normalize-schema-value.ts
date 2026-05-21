import type { ActionSchema } from '../typings';
import { parseOptionalNumber } from './parse-optional-number';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isEmptyNormalizedValue(value: unknown): boolean {
  return (
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (isRecord(value) && Object.keys(value).length === 0)
  );
}

export function normalizeSchemaValue(value: unknown, schema?: ActionSchema): unknown {
  if (!schema || typeof schema !== 'object') {
    return value;
  }

  const schemaType = (schema as { type?: string }).type;

  if (schemaType === 'number' || schemaType === 'integer') {
    if (typeof value === 'number' || typeof value === 'string') {
      const parsed = parseOptionalNumber(value);

      if (parsed !== undefined) {
        return parsed;
      }

      return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
    }

    return value;
  }

  if (schemaType === 'object' && isRecord(value)) {
    const properties = (schema as { properties?: Record<string, ActionSchema> })
      .properties;

    return Object.entries(value).reduce<Record<string, unknown>>((arr, [key, val]) => {
      const normalizedVal = normalizeSchemaValue(val, properties?.[key]);

      if (!isEmptyNormalizedValue(normalizedVal)) {
        arr[key] = normalizedVal;
      }

      return arr;
    }, {});
  }

  if (schemaType === 'array' && Array.isArray(value)) {
    const itemSchema = (schema as { items?: ActionSchema }).items;

    return value
      .map((item) => normalizeSchemaValue(item, itemSchema))
      .filter((item) => !isEmptyNormalizedValue(item));
  }

  return value;
}
