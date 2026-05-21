import type { ScreenshotProp } from '../typings';
import { buildArgsParam } from '@storybook/core/router';

const SAFE_KEY_PATTERN = /^[\w -]*$/;
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;
const HEX_COLOR_PATTERN = /^#([a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i;
const FUNCTION_COLOR_PATTERN =
  /^(rgba?|hsla?)\((\d{1,3}),\s?(\d{1,3})%?,\s?(\d{1,3})%?,?\s?(\d(\.\d{1,2})?)?\)$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeArgValue(key: string, value: unknown): boolean {
  if (key === null || key === '' || !SAFE_KEY_PATTERN.test(key)) {
    return false;
  }

  if (value === undefined || value === null) {
    return true;
  }

  if (value instanceof Date) {
    return true;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'string') {
    return (
      SAFE_KEY_PATTERN.test(value) ||
      NUMBER_PATTERN.test(value) ||
      HEX_COLOR_PATTERN.test(value) ||
      FUNCTION_COLOR_PATTERN.test(value)
    );
  }

  if (Array.isArray(value)) {
    return value.every((item) => isSafeArgValue(key, item));
  }

  if (isPlainObject(value)) {
    return Object.entries(value).every(([entryKey, entryValue]) =>
      isSafeArgValue(entryKey, entryValue),
    );
  }

  return false;
}

function pruneUnsafeArgs(value: unknown): unknown {
  if (Array.isArray(value)) {
    const prunedArray = value
      .map((item) => pruneUnsafeArgs(item))
      .filter((item) => item !== undefined);

    return prunedArray.length > 0 ? prunedArray : undefined;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).reduce((acc, [key, entryValue]) => {
      if (!SAFE_KEY_PATTERN.test(key)) {
        return acc;
      }

      if (isPlainObject(entryValue) || Array.isArray(entryValue)) {
        const nested = pruneUnsafeArgs(entryValue);

        if (nested !== undefined) {
          acc[key] = nested;
        }

        return acc;
      }

      if (isSafeArgValue(key, entryValue)) {
        acc[key] = entryValue;
      }

      return acc;
    }, {} as ScreenshotProp);

    return Object.keys(entries).length > 0 ? entries : undefined;
  }

  return undefined;
}

export function storybookPropsToQuerystring(props?: ScreenshotProp) {
  if (!props || Object.keys(props).length === 0) return '';

  const safeProps = pruneUnsafeArgs(props) as ScreenshotProp | undefined;
  if (!safeProps || Object.keys(safeProps).length === 0) {
    return '';
  }

  return buildArgsParam({}, safeProps);
}
