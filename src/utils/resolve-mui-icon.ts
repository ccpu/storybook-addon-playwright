import type React from 'react';

export function resolveMuiIcon(iconModule: unknown): React.ElementType {
  const maybeModule = iconModule as { default?: React.ElementType };
  return (maybeModule.default ??
    (iconModule as React.ElementType)) as React.ElementType;
}
