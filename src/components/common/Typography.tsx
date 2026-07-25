import { css, cx } from '@emotion/css';
import React from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption';

export interface TypographyProps {
  variant?: TypographyVariant;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  children?: React.ReactNode;
}

const VARIANT_ELEMENT: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
};

const VARIANT_STYLE: Partial<Record<TypographyVariant, React.CSSProperties>> = {
  h6: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 },
  subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.75 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 },
};

const baseClass = css({ margin: 0 });

/** Text element with MUI-`Typography`-like `variant` support. */
const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  className,
  style,
  title,
  children,
}) => {
  const Element = VARIANT_ELEMENT[variant] as React.ElementType;

  return (
    <Element
      className={cx(baseClass, className)}
      title={title}
      style={{ ...VARIANT_STYLE[variant], ...style }}
    >
      {children}
    </Element>
  );
};

Typography.displayName = 'Typography';

export { Typography };
