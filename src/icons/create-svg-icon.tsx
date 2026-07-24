import * as React from 'react';

export type SvgIconProps = Omit<React.SVGProps<SVGSVGElement>, 'fontSize'> & {
  fontSize?: 'inherit' | 'small' | 'medium' | 'large' | number;
  titleAccess?: string;
};

const FONT_SIZE_MAP: Record<string, string> = {
  inherit: 'inherit',
  small: '1.25rem',
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

  const Icon: React.FC<SvgIconProps> = ({ fontSize, titleAccess, style, ...props }) => {
    const resolvedFontSize =
      typeof fontSize === 'number'
        ? fontSize
        : fontSize
          ? FONT_SIZE_MAP[fontSize]
          : undefined;

    return (
      <svg
        viewBox="0 0 24 24"
        focusable="false"
        aria-hidden={titleAccess ? undefined : true}
        role={titleAccess ? 'img' : undefined}
        fill="currentColor"
        width="1em"
        height="1em"
        style={{ fontSize: resolvedFontSize, ...style }}
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
