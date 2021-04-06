import { Position } from '../typings';

export function getPointByDirection(
  defaultVal: number,
  direction: 'x' | 'y',
  providedPoint?: Position,
): number {
  if (!providedPoint || !providedPoint[direction]) return defaultVal;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return providedPoint[direction]!;
}
