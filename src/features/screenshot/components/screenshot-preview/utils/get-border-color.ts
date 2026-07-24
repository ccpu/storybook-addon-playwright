import { darken, lighten } from '../../../../../utils';

export const getBorderColor = (
  type: 'dark' | 'light',
  color: string,
  coefficient = 0.1,
) => {
  return type === 'dark' ? lighten(color, coefficient) : darken(color, coefficient);
};
