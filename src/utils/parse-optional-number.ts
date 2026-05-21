export function parseOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return undefined;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}
