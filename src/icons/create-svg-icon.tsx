import * as React from 'react';
import { useTheme } from '../styles';
import { PaletteColor } from '../features/theme';

export type SvgIconProps = Omit<React.SVGProps<SVGSVGElement>, 'fontSize' | 'color'> & {
  fontSize?: 'inherit' | 'small' | 'medium' | 'large' | number;
  titleAccess?: string;
  color?: 'primary' | 'secondary' | 'action' | 'error';
};

const FONT_SIZE_MAP: Record<string, string> = {
  inherit: 'inherit',
  small: '1rem',
  medium: '1.5rem',
  large: '2.1875rem',
};

/**
 * Creates a themeable SVG icon component from raw path data, replacing
 * `@mui/icons-material`'s `createSvgIcon`. The rendered `<svg>` sizes to the
 * current font size (`1em`) and inherits `currentColor`, matching the behaviour
 * the old MUI icons provided at existing call sites.
 */
export function createSvgIcon(pathData: string | string[], displayName: string) {
  const paths = Array.isArray(pathData) ? pathData : [pathData];

  const Icon: React.FC<SvgIconProps> = ({
    fontSize = 'small',
    titleAccess,
    color,
    style,
    ...props
  }) => {
    const resolvedFontSize =
      typeof fontSize === 'number'
        ? fontSize
        : fontSize
          ? FONT_SIZE_MAP[fontSize]
          : undefined;

    const theme = useTheme();

    const themeColor = color ? (theme.palette[color] as PaletteColor).main : undefined;

    return (
      <svg
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden={titleAccess ? undefined : true}
        role={titleAccess ? 'img' : undefined}
        fill="currentColor"
        width="1em"
        height="1em"
        style={{ fontSize: resolvedFontSize, color: themeColor, ...style }}
        {...props}
      >
        {titleAccess ? <title>{titleAccess}</title> : null}
        {paths.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </svg>
    );
  };

  Icon.displayName = displayName;

  return Icon;
}
