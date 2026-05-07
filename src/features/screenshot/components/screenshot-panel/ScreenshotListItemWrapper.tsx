import type { ListItemWrapperProps } from '../../../../components/common';
import React from 'react';
import { ListItemWrapper } from '../../../../components/common';

const ScreenshotListItemWrapper: React.FC<ListItemWrapperProps> = ({
  children,
  ...rest
}) => {
  return (
    <ListItemWrapper
      style={{
        cursor: 'pointer',
      }}
      icons={children}
      {...rest}
    />
  );
};

ScreenshotListItemWrapper.displayName = 'ScreenshotListItemWrapper';

export { ScreenshotListItemWrapper };
